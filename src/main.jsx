import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <App />
      <Toaster position="top-right" richColors/>
    </NextUIProvider>
  </StrictMode>
);
