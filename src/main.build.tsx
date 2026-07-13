import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  const message = "Elemento raiz #root não encontrado. A aplicação não pode iniciar.";
  console.error(message);
  document.body.innerHTML = `
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#f5f5f5;font-family:system-ui,sans-serif;padding:24px;text-align:center">
      <div>
        <p style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#d4ff00;margin:0 0 12px">TAG08</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 12px">Elemento raiz ausente</h1>
        <p style="max-width:560px;margin:0 auto;color:#d4d4d8">Verifique se o HTML de entrada contém <code>#root</code> antes de iniciar o React.</p>
      </div>
    </main>
  `;
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary boundaryName="app-root">
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
