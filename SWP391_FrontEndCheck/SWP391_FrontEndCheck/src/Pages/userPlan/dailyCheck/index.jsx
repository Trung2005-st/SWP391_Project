import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AfterProgressPlan from "./afterProgressStep";
import DailyProgressPage from "./dailyCheck";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DailyProgressPage />
    </BrowserRouter>
  </StrictMode>
);
