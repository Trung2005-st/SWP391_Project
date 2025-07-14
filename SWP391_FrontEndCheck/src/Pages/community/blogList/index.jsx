import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";
import BlogService from "./blogList";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BlogService />
    </BrowserRouter>
  </StrictMode>
);
