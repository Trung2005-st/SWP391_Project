import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../profile";
import FeedbackPage from "./feedback";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FeedbackPage />
    </BrowserRouter>
  </StrictMode>
);
