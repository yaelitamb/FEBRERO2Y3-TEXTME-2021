"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MessageList from "@/components/MessageList";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session?.token) {
          setIsAuthenticated(true); // Usuario autenticado
        } else {
          router.push("/signin"); // Redirige si no hay sesión
        }
      } catch (error) {
        console.error("Error verificando la autenticación:", error);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated) return <p>Cargando...</p>;

  return (
    <div>
      <MessageList /> {/* Muestra los mensajes del usuario */}
    </div>
  );
}
