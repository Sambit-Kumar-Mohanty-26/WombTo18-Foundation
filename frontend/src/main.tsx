
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { ContentProvider } from "./app/context/ContentContext.tsx";
import "./app/i18n";

createRoot(document.getElementById("root")!).render(
  <ContentProvider>
    <App />
  </ContentProvider>
);
  