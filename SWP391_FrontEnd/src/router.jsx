import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/home/home";
import AdminUser from "./Pages/adminUser/AdminUser";
import AdminQuitPlan from "./Pages/adminQuitPlan/AdminQuitPlan";
import AdminMembership from "./Pages/adminMembership/AdminMembership";

function Router() {
  const ROUTER = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/adminUser",
      element: <AdminUser />,
    },
    {
      path: "/adminQuit",
      element: <AdminQuitPlan />,
    },
    {
      path: "/adminMembership",
      element: <AdminMembership />,
    },
  ]);

  return <RouterProvider router={ROUTER} />;
}

export default Router;
