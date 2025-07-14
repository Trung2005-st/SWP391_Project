import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";
import BlogService from "./blogList";
import BlogDetail from "./blogDetail";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BlogDetail />
    </BrowserRouter>
  </StrictMode>
);
