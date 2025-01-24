import { auth } from "@/auth";

export default async function handler(req, res) {
  const session = await auth();

  if (session?.token) {
    res.status(200).json(session);
  } else {
    res.status(401).json({ error: "Usuario no autenticado" });
  }
}
