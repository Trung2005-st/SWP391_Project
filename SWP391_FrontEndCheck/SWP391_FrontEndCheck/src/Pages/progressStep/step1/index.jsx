import { StrictMode } from "react";
import ProgressComponent1 from "./progressStep1";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProgressComponent1 />
    </BrowserRouter>
  </StrictMode>
);
