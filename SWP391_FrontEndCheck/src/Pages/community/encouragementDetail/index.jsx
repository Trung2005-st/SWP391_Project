import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import SendEncouragementForm from "./encouragementDetail";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SendEncouragementForm />
    </BrowserRouter>
  </StrictMode>
);
