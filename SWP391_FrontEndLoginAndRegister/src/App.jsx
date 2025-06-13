import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import OverviewPage from "./pages/dashboard-admin/overview";
import ManageProduct from "./pages/dashboard-admin/product";
import ManageUser from "./pages/dashboard-admin/user";
import Header from "./components/header";
import Footer from "./components/footer";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: 
      <>
        <Header/>
        <Outlet/>
        <Footer/>
     </>
     ,
      children:[
        {
          path: "/",
          element: <HomePage/>,
        },
        {
          path: "about",
          element: <div>about</div>,
        }
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children:[
        {
          path: "overview",
          element: <OverviewPage/>
        },
        {
          path: "product",
          element: <ManageProduct/>
        },
        {
          path: "user",
          element: <ManageUser/>
        }
      ]
    },
  ]);

  return (
    <>
      <Provider store={store}>
         <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
