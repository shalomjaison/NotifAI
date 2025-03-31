/*
    Data Baes
    2/28/2025

    Main component of React App. Handles UI, React components, and underlying logic of frontend
*/

import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from "./LoginPageComponents/Login/Login"; 
import ProtectedRoute from "./ProtectedRoute"; 
import MainPage from "./MainPageComponents/MainPage";


// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

