import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de tener esta variable configurada
  pages: {
    signIn: "/signin", // Opcional, personaliza la página de inicio de sesión si es necesario
    error: "/api/auth/error", // Página de error personalizada
  },
  debug: true, // Habilita depuración
});
