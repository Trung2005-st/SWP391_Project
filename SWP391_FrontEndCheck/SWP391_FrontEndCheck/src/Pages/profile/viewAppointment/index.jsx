import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";
import AppointmentPage from "./appointmentForm";
import AppointmentUpdate from "./appointmentForm";
import AppointmentView from "./appointmentForm";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppointmentView />
    </BrowserRouter>
  </StrictMode>
);
