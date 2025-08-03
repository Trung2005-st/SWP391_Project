import { StrictMode } from "react";
import ProgressComponent2 from "./progressStep2";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProgressComponent2 />
    </BrowserRouter>
  </StrictMode>
);
