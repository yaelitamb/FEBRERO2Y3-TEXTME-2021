"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MessageList({ email }) {
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/header/${email}`,
          { method: "GET" }
        );

        if (!response.ok) {
          throw new Error("Error al cargar los mensajes");
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error al cargar los mensajes:", error);
      }
    };

    fetchMessages();
  }, [email]);

  const handleClick = (id) => {
    router.push(`/message/${id}`);
  };

  if (!messages.length) return <p>No hay mensajes disponibles</p>;

  return (
    <div>
      <h2>Mensajes:</h2>
      {messages.map((msg) => (
        <div
          key={msg.id}
          onClick={() => handleClick(msg.id)}
          style={{ cursor: "pointer" }}
        >
          <h3>{msg.asunto}</h3>
          <p>De: {msg.de} | Para: {msg.para}</p>
          <p>{msg.stamp}</p>
        </div>
      ))}
    </div>
  );
}
