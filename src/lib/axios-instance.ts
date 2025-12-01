import axios from "axios";
import { BASE_URL } from "./config";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json,",
  },
  withCredentials: false,
});