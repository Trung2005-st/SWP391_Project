import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AfterProgressPlan from "./afterProgressStep";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AfterProgressPlan />
    </BrowserRouter>
  </StrictMode>
);
