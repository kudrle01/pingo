import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from "@/App";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ToastProvider } from "@/components/ToastProvider";
import "@/index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ConvexAuthProvider>
  </StrictMode>
);
