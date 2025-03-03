import { FetusGender } from "@/types/user";

export const genderOptions = [
  ...Object.values(FetusGender).map((gender) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }),
  "Cancel",
];
