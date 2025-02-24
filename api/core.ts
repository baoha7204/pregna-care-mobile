import axios from "axios";

export const customAxios = axios.create({
  baseURL: "http://10.0.2.2:8080/api/v1",
});
