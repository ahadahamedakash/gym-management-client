import { createBrowserRouter } from "react-router";

import Home from "../pages/Home";
import Users from "../pages/admin/Users";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Subscriptions from "../pages/admin/Subscriptions";
import UserDashboard from "../pages/user/UserDashboard";
import AvailableSubscriptions from "../pages/user/AvailableSubscriptions";
import MySubscriptions from "../pages/user/MySubscriptions";
import Enrollments from "../pages/admin/Enrollments";

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
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "subscriptions",
            element: <Subscriptions />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "enrollments",
            element: <Enrollments />,
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
            index: true,
            element: <UserDashboard />,
          },
          {
            path: "subscriptions",
            element: <AvailableSubscriptions />,
          },
          {
            path: "my-subscriptions",
            element: <MySubscriptions />,
          },
        ],
      },
    ],
  },
]);
