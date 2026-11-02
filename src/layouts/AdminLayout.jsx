import DashboardLayout from "./DashboardLayout";

const links = [
  { to: "/admin", label: "Overview", icon: "▦", end: true },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: "▣" },
  { to: "/admin/users", label: "Users", icon: "♙" },
  { to: "/admin/enrollments", label: "Enrollments", icon: "☷" },
];

const AdminLayout = () => <DashboardLayout role="admin" links={links} />;

export default AdminLayout;
