import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../profile";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>
  </StrictMode>
);
