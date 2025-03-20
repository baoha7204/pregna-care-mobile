import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/auth.context";
import { router } from "expo-router";

const useSession = () => {
  const context = useContext(AuthContext);

  // Check if we're within a SessionProvider
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  // Additional convenience method for router redirections based on auth state
  const redirectToAuthPage = () => {
    router.replace("/sign-in");
  };

  const redirectToHome = () => {
    router.replace("/(app)/(tabs)/(home)");
  };

  return {
    ...context,
    redirectToAuthPage,
    redirectToHome,
  };
};

export default useSession;
