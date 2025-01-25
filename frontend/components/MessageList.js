"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MessageList({ email }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [messageDetails, setMessageDetails] = useState(null);
  const [formData, setFormData] = useState({
    de: email,
    para: "",
    asunto: "",
    contenido: "",
    adjunto: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const fetchMessageDetails = async (id) => {
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
      setMessageDetails(null);
      return;
    }

    setSelectedMessageId(id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/message/${id}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Error al cargar el mensaje");
      }

      const data = await response.json();
      setMessageDetails(data);
    } catch (error) {
      console.error("Error al cargar los detalles del mensaje:", error);
    }
  };

  const handleReply = (msg) => {
    setFormData({
      de: email,
      para: msg.de,
      asunto: `Re: ${msg.asunto}`,
      contenido: "",
      adjunto: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);
    uploadFormData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        uploadFormData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Error al subir la imagen.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await handleImageUpload();

    const messageData = {
      ...formData,
      adjunto: imageUrl || "",
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      alert("Mensaje enviado con éxito");
      setFormData({
        de: email,
        para: "",
        asunto: "",
        contenido: "",
        adjunto: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("No se pudo enviar el mensaje.");
    } finally {
      setLoading(false);
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [email]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Tus Mensajes
      </h2>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-200"
          >
            <div
              onClick={() => fetchMessageDetails(msg.id)}
              className="cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {msg.asunto}
              </h3>
              <p className="text-gray-600">
                <strong>De:</strong> {msg.de} | <strong>Para:</strong> {msg.para}
              </p>
              <p className="text-sm text-gray-500">{msg.stamp}</p>
            </div>

            {selectedMessageId === msg.id && messageDetails && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700 whitespace-pre-line">
                  <strong>Contenido:</strong> {messageDetails.contenido}
                </p>
                {messageDetails.adjunto && (
                  <div className="mt-4">
                    <img
                      src={messageDetails.adjunto}
                      alt="Adjunto"
                      className="rounded-lg shadow-md max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition duration-200"
              onClick={() => handleReply(msg)}
            >
              Responder
            </button>
          </div>
        ))}

        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {formData.para ? "Responder Mensaje" : "Crear Mensaje"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                De
              </label>
              <input
                type="email"
                name="de"
                value={formData.de}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-200 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Para
              </label>
              <input
                type="email"
                name="para"
                value={formData.para}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asunto
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adjunto
              </label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 text-white rounded-lg shadow ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
