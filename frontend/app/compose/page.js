"use client";
import { useState } from "react";
import { apiClient } from "@/utils/apiClient";

export default function ComposeMessage() {
  const [image, setImage] = useState(null);

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = await apiClient();

    const imageUrl = await handleImageUpload();
    const message = {
      de: e.target.de.value,
      para: e.target.para.value,
      asunto: e.target.asunto.value,
      contenido: e.target.contenido.value,
      adjunto: imageUrl,
    };

    try {
      await client.post("/message", message);
      alert("Mensaje enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="de" placeholder="De" required />
      <input type="email" name="para" placeholder="Para" required />
      <input type="text" name="asunto" placeholder="Asunto" required />
      <textarea name="contenido" placeholder="Contenido" required />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Enviar</button>
    </form>
  );
}
