import axios from "axios";

// const API_KEY = "http://localhost:8000/api/v1";
const API_KEY = "https://express-auth-system.vercel.app/api/v1";

export const Request = axios.create({
  baseURL: API_KEY,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
