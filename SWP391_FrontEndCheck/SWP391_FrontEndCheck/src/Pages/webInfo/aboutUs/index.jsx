import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import AboutUs from "./aboutUs";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AboutUs />
    </BrowserRouter>
  </StrictMode>
);
