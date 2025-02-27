import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { SplashScreen } from "expo-router";

import { useStorageState } from "../hooks/useStorageState";
import { customAxios } from "@/api/core";
import { FetusGender, UserRoles } from "@/types/user";
import { calculatePregnancyWeek } from "@/utils/core";

export type Fetus = {
  id: string;
  name: string;
  dueDate: number;
  gender: FetusGender;
  weeks: number;
};

type User = {
  email: string;
  role: UserRoles;
  avatarUrl: string | null;
  fetuses: Omit<Fetus, "weeks">[];
};

type AuthStatus = {
  session?: string | null;
  authenticated: boolean | null;
};

type AuthContextType = {
  user: User | null;
  currentFetus: Fetus | null;
  switchFetus: (fetus: Fetus) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  currentFetus: null,
  switchFetus: () => {},
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
  const [user, setUser] = useState<User | null>(null);
  const [currentFetus, setCurrentFetus] = useState<Fetus | null>(null);

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
      setSession(result.data.data.accessToken);
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

  const switchFetus = (fetus: Fetus) => {
    setCurrentFetus(fetus);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await customAxios.get("/users/self");
        setUser(result.data.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };

    const setAuth = () => {
      customAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session}`;
      setAuthenticated(true);
    };

    if (session) {
      setAuth();
      fetchUser();
    }
  }, [session]);

  useEffect(() => {
    if (user && user.fetuses.length) {
      const selectedFetus = user.fetuses[0];
      const weeks = calculatePregnancyWeek(selectedFetus.dueDate);
      setCurrentFetus({ ...selectedFetus, weeks });
    }
  }, [user?.fetuses]);

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
        user,
        currentFetus,
        switchFetus,
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
