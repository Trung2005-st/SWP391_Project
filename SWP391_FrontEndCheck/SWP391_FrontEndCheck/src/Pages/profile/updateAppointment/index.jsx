import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";
import AppointmentPage from "./appointmentForm";
import AppointmentUpdate from "./appointmentForm";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppointmentUpdate />
    </BrowserRouter>
  </StrictMode>
);
