import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CoachList />
    </BrowserRouter>
  </StrictMode>
);
