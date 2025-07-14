import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import SendEncouragement from "./encouragement";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SendEncouragement />
    </BrowserRouter>
  </StrictMode>
);
