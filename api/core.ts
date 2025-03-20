import axios from "axios";

export const customAxios = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API_URL,
});
