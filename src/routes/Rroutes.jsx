import { createBrowserRouter } from "react-router";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import RootLayout from "../layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
