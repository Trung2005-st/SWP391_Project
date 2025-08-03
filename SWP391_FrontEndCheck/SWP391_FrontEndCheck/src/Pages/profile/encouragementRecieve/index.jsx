import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import BlogManagerPage from "./blogManager";
import ArchivePage from "./encouragementRecieve";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ArchivePage />
    </BrowserRouter>
  </StrictMode>
);
