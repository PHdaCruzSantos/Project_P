// src/clerk.ts
import clerkPlugin from "vue-clerk";

export default clerkPlugin({
  frontendApi: import.meta.env.VITE_CLERK_FRONTEND_API, // Adicione sua frontend API Clerk ao .env
  // Opcional: redirecionamentos automáticos
  redirectUrl: "/",
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
});
