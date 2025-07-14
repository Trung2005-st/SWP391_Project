import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  redirect,
} from "react-router-dom";

import Home from "./Pages/home/home";
import AdminUser from "./Pages/admin/adminUser/AdminUser";
import AdminQuitPlan from "./Pages/admin/adminQuitPlan/AdminQuitPlan";
import AdminMembership from "./Pages/admin/adminMembership/AdminMembership";
import LoginPage from "./Pages/authentication/login";
import RegisterPage from "./Pages/authentication/register";
import { ROUTES } from "./configs/routes";
import AdminCoachProfile from "./Pages/admin/adminCoachProfile/AdminCoachProfile";
import ForgotPasswordPage from "./Pages/authentication/forgot-password";
import ResetPasswordPage from "./Pages/authentication/reset-password";
import VerifyUserPage from "./Pages/authentication/verify-user";
import VerifyPasswordPage from "./Pages/authentication/verify-password";
import AdminCoachRegister from "./Pages/admin/adminCoachRegister/AdminCoachRegister";
import DashboardPage from "./Pages/admin/dashboard/dashboardPage";
import ProgressComponent1 from "./Pages/progressStep/step1/progressStep1";
import ProgressComponent2 from "./Pages/progressStep/step2/progressStep2";
import ProgressComponent3 from "./Pages/progressStep/step3/progressStep3";
import ProgressComponent4 from "./Pages/progressStep/step4/progressStep4";
import ProgressComponent5 from "./Pages/progressStep/step5/progressStep5";
import AfterProgressPlan from "./Pages/userPlan/freePlan/afterProgressStep";
import { ProgressProvider } from "./configs/ProgressContext";
import ProfilePage from "./Pages/profile/profileItem/profile";
import CoachList from "./Pages/coachFunction/coachList/coachList";
import AboutUs from "./Pages/webInfo/aboutUs/aboutUs";

// chỉ thêm dòng này:
import { requireAuthLoader } from "./configs/requireAuthLoader";
import BlogService from "./Pages/community/blogList/blogList";
import BlogDetail from "./Pages/community/blogDetail/blogDetail";
import CreateBlog from "./Pages/community/createBlog/createBlog";
import ChatPage from "./Pages/chat/chatPage";
import SendEncouragement from "./Pages/community/encouragement/encouragement";
import SendEncouragementForm from "./Pages/community/encouragementDetail/encouragementDetail";
import BlogManagerPage from "./Pages/profile/blogManager/blogManager";
import ArchivePage from "./Pages/profile/encouragementRecieve/encouragementRecieve";

function Router() {
  const router = createBrowserRouter([
    // Public
    { path: ROUTES.HOME, element: <Home /> },
    { path: ROUTES.LOGIN, element: <LoginPage /> },
    { path: ROUTES.REGISTER, element: <RegisterPage /> },
    { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
    { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    { path: "/verifyUser/:email", element: <VerifyUserPage /> },
    { path: "/verifyPassword/:email", element: <VerifyPasswordPage /> },

    // Protected (chỉ thêm loader, không thay đổi gì khác)
    {
      path: ROUTES.ADMIN_USER,
      element: <AdminUser />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ADMIN_QUIT,
      element: <AdminQuitPlan />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ADMIN_MEMBERSHIP,
      element: <AdminMembership />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ADMIN_COACHPROFILE,
      element: <AdminCoachProfile />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ADMIN_REGISTER,
      element: <AdminCoachRegister></AdminCoachRegister>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ADMIN_DASHBOARD,
      element: <DashboardPage />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROGRESS_STEP1,
      element: <ProgressComponent1></ProgressComponent1>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROGRESS_STEP2,
      element: <ProgressComponent2></ProgressComponent2>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROGRESS_STEP3,
      element: <ProgressComponent3></ProgressComponent3>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROGRESS_STEP4,
      element: <ProgressComponent4></ProgressComponent4>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROGRESS_STEP5,
      element: <ProgressComponent5></ProgressComponent5>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.AFTER_PROGRESS_STEP,
      element: <AfterProgressPlan></AfterProgressPlan>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.COACH_LIST,
      element: <CoachList></CoachList>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ABOUT_US,
      element: <AboutUs></AboutUs>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.BLOG_SERVICE,
      element: <BlogService></BlogService>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.BLOG_DETAIL,
      element: <BlogDetail></BlogDetail>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.CREATE_BLOG,
      element: <CreateBlog></CreateBlog>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.BLOG_SERVICE,
      element: <BlogService></BlogService>,
      loader: requireAuthLoader,
    },
    {
      path: `${ROUTES.CHAT}/:contactId`,
      element: <ChatPage />,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.SEND_ENCOURAGEMENT,
      element: <SendEncouragement></SendEncouragement>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.SEND_ENCOURAGEMENT_FORM,
      element: <SendEncouragementForm></SendEncouragementForm>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.PROFILE_PAGE,
      element: <ProfilePage></ProfilePage>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.BLOG_MANAGER,
      element: <BlogManagerPage></BlogManagerPage>,
      loader: requireAuthLoader,
    },
    {
      path: ROUTES.ARCHIVE_PAGE,
      element: <ArchivePage></ArchivePage>,
      loader: requireAuthLoader,
    },
    // fallback
    {
      path: "*",
      loader: () => redirect(ROUTES.HOME),
    },
  ]);

  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}

export default Router;
