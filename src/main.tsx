import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <App />
    <Toaster
      toastOptions={{
        unstyled: true,
        classNames: {
          error:
            "flex items-center justify-center bg-teal-50 text-red-800 p-4 rounded-full font-bold text-1xl",
          success:
            "flex items-center justify-center bg-teal-50 text-green-600 p-4 rounded-full font-bold text-1xl",
        },
      }}
    />
  </SocketProvider>
);
