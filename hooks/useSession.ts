import { useContext } from "react";

import { AuthContext } from "@/contexts/auth.context";

const useSession = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
};

export default useSession;
