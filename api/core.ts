import axios from "axios";

export const customAxios = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});
