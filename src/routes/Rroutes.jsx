import { createBrowserRouter } from "react-router";

import Home from "../pages/Home";
import Users from "../pages/Users";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import Subscriptions from "../pages/Subscriptions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "subscriptions",
            element: <Subscriptions />,
          },
          {
            path: "users",
            element: <Users />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["user"]} />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "subscriptions",
            element: <Subscriptions />,
          },
        ],
      },
    ],
  },
]);
