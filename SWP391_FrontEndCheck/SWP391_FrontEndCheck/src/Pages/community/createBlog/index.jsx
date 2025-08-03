import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import CoachList from "./coachList";
import BlogService from "./blogList";
import CreateBlog from "./createBlog";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CreateBlog />
    </BrowserRouter>
  </StrictMode>
);
