import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/home/home";
import AdminUser from "./Pages/adminUser/AdminUser";
import AdminQuitPlan from "./Pages/adminQuitPlan/AdminQuitPlan";
import AdminMembership from "./Pages/adminMembership/AdminMembership";
import LoginPage from "./Pages/login";
import RegisterPage from "./Pages/register";
import { ROUTES } from "./configs/routes";
import AdminCoachProfile from "./Pages/adminCoachProfile/AdminCoachProfile";

function Router() {
  const router = createBrowserRouter([
    { path: ROUTES.HOME, element: <Home /> },
    { path: ROUTES.LOGIN, element: <LoginPage /> },
    { path: ROUTES.REGISTER, element: <RegisterPage /> },
    { path: ROUTES.ADMIN_USER, element: <AdminUser /> },
    { path: ROUTES.ADMIN_QUIT, element: <AdminQuitPlan /> },
    { path: ROUTES.ADMIN_MEMBERSHIP, element: <AdminMembership /> },
    { path: ROUTES.ADMIN_COACHPROFILE, element: <AdminCoachProfile /> },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
