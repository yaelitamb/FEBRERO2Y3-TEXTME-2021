"use client";
import { useEffect, useState } from "react";
import { apiClient } from "@/utils/apiClient";
import { useRouter } from "next/navigation";

export default function MessageDetails({ params }) {
  const { id } = params;
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const client = await apiClient();
        const { data } = await client.get(`/message/${id}`);
        setMessage(data);
      } catch (error) {
        console.error("Error al cargar el mensaje:", error);
        router.push("/"); // Si falla, redirige a la página principal
      }
    };

    fetchMessage();
  }, [id, router]);

  if (!message) return <p>Cargando mensaje...</p>;

  return (
    <div>
      <h1>{message.asunto}</h1>
      <p>De: {message.de}</p>
      <p>Para: {message.para}</p>
      <p>{message.contenido}</p>
      {message.adjunto && <img src={message.adjunto} alt="Adjunto" />}
    </div>
  );
}
