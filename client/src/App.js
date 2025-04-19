/*
    Data Baes
    2/28/2025

    Main component of React App. Handles UI, React components, and underlying logic of frontend
*/

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./MainPageComponents/MainPage";
import Login from "./LoginPageComponents/Login/Login";
import SignUp from "./SignUpComponents/SignUp";
import EmailPage from "./EmailPopupComponent/EmailPage";
import Profile from "./ProfilePageComponents/Profile";

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/main",
    element: <MainPage />,
  },
  {
    path: "/main/email/:id",
    element: <EmailPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
