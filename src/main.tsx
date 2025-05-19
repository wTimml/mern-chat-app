import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster
      toastOptions={{
        unstyled: true,
        classNames: {
          error:
            "flex items-center justify-center bg-primary text-red-800 p-4 rounded-full font-bold text-1xl",
          success:
            "flex items-center justify-center bg-primary text-green-600 p-4 rounded-full font-bold text-1xl",
        },
      }}
    />
  </>
);
