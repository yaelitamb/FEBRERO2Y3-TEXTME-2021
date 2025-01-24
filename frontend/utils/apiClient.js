import axios from "axios";

export const apiClient = async () => {
  // Usa el endpoint de sesión
  const sessionResponse = await fetch("/api/auth/session");
  const session = await sessionResponse.json();

  if (!session?.token) throw new Error("Usuario no autenticado");

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  return instance;
};
