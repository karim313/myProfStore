import { api } from "../axios";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/api/Auth/login", {
    email,
    password,
  });

  return res.data;
};

export const registerApi = async (data: { userName: string; email: string; password: string }) => {
  const res = await api.post("/api/Auth/register", data);
  return res.data;
};