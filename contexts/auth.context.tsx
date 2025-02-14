import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { SplashScreen } from "expo-router";

import { useStorageState } from "../hooks/useStorageState";
import { customAxios } from "@/api/core";

type AuthStatus = {
  session?: string | null;
  authenticated: boolean | null;
};

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  status: {
    session: null,
    authenticated: false,
  },
  isLoading: false,
});

const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await customAxios.post("/auth/signup", { email, password });
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await customAxios.post("/auth/signin", {
        email,
        password,
      });
      const token = result.data.data.accessToken;
      setSession(token);
      setAuthenticated(true);

      customAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setSession(null);
      setAuthenticated(false);
      delete customAxios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      if (session) {
        customAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session}`;
        setAuthenticated(true);
      }
    };

    checkSession();
  }, [session]);

  useEffect(() => {
    if (isLoading) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        status: {
          session,
          authenticated,
        },
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, SessionProvider };
