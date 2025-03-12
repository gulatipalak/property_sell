import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Root element not found! Check your HTML file.");
}

createRoot(rootElement).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>
);
