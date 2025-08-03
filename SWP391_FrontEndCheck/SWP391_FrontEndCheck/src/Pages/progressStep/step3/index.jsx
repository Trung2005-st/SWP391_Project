import { StrictMode } from "react";
import ProgressComponent3 from "./progressStep3";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProgressComponent3 />
    </BrowserRouter>
  </StrictMode>
);
