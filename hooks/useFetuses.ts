import { useContext } from "react";
import { FetusesContext } from "@/contexts/fetuses.context";

const useFetuses = () => {
  const value = useContext(FetusesContext);
  if (!value) {
    throw new Error("useFetuses must be wrapped in a <FetusesProvider />");
  }

  return value;
};

export default useFetuses;
