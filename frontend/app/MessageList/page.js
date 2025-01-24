// app/MessageList/page.js
import { auth } from "@/auth"; // Llama a la función del servidor
import MessageList from "@/components/MessageList";

export default async function MessageListPage() {
  const session = await auth(); // Obtén la sesión en el servidor
  const email = session?.user?.email;

  if (!email) {
    // Maneja el caso de usuario no autenticado (redirige o muestra un mensaje)
    return <p>Usuario no autenticado. Por favor, inicia sesión.</p>;
  }

  return (
    <div>
      <h1>Tus Mensajes</h1>
      <MessageList email={email} /> {/* Pasa el email como prop */}
    </div>
  );
}
