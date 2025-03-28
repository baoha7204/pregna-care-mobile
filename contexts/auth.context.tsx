import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { router, SplashScreen } from "expo-router";

import { useStorageState } from "../hooks/useStorageState";
import { customAxios } from "@/api/core";
import { UserRoles } from "@/types/user";
import { ApiResponse } from "@/types/core";
import { Fetus } from "./fetuses.context";

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

type OTPResponseData = {
  id: string;
  email: string;
  verificationMethod: string;
  otpCode?: string;
};

type AuthContextType = {
  user: User | null;
  isFetchingUser: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<OTPResponseData | null>;
  verifyOtp: (userId: string, otp: string) => Promise<void>;
  resendOtp: (userId: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: AuthStatus;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isFetchingUser: false,
  signIn: () => Promise.resolve(false),
  signUp: () => Promise.resolve(null),
  verifyOtp: () => Promise.resolve(),
  resendOtp: () => Promise.resolve(),
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
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const result = await customAxios.post("/auth/signup", {
        email,
        password,
        verificationMethod: "otp",
      });

      if (result.data.success) {
        return result.data.data as OTPResponseData;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  const verifyOtp = useCallback(async (userId: string, otp: string) => {
    try {
      const result = await customAxios.post("/auth/confirm-otp", {
        userId,
        otp,
      });

      if (result.data.success) {
        setSession(result.data.data.accessToken);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const resendOtp = useCallback(async (userId: string, email: string) => {
    try {
      await customAxios.post("/auth/resend-otp", { userId, email });
    } catch (error) {
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const result = await customAxios.post("/auth/signin", {
        email,
        password,
      });

      // Set session token which should trigger the useEffect that fetches user data
      setSession(result.data.data.accessToken);

      // Set authenticated state immediately so the route guards work properly
      setAuthenticated(true);

      // Set up auth header immediately
      customAxios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.data.accessToken}`;

      // Trigger user fetch
      const userResult = await customAxios.get<ApiResponse<User | null>>(
        "/users/self"
      );
      setUser(userResult.data.data);

      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setUser(null);
      setSession(null);
      setAuthenticated(false);
      delete customAxios.defaults.headers.common["Authorization"];
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!session) {
      setAuthenticated(false);
      return;
    }

    const fetchUser = async () => {
      setIsFetchingUser(true);
      try {
        // Set auth header
        customAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session}`;

        const result = await customAxios.get<ApiResponse<User | null>>(
          "/users/self"
        );

        if (result.data.success && result.data.data) {
          setUser(result.data.data);
          setAuthenticated(true);
        } else {
          // If we can't fetch the user data, the session might be invalid
          setUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
      } finally {
        setIsFetchingUser(false);
      }
    };

    fetchUser();
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
        user,
        isFetchingUser,
        signIn,
        signUp,
        verifyOtp,
        resendOtp,
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
