import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/MessageList" });
        }}
        className="flex flex-col items-center space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inicia Sesión</h1>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
