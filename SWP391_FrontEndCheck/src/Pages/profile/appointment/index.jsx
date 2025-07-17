import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AppointmentPage from "./appointment";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppointmentPage />
    </BrowserRouter>
  </StrictMode>
);
