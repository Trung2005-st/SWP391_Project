import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import BlogManagerPage from "./blogManager";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BlogManagerPage />
    </BrowserRouter>
  </StrictMode>
);
