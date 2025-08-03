import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import EditBlogPage from "./editBlog";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <EditBlogPage />
    </BrowserRouter>
  </StrictMode>
);
