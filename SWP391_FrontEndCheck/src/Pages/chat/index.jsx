import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ChatPage from "./chatPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChatPage />
    </BrowserRouter>
  </StrictMode>
);
