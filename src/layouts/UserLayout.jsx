import DashboardLayout from "./DashboardLayout";

const links = [
  { to: "/user", label: "Overview", icon: "▦", end: true },
  { to: "/user/subscriptions", label: "Available Plans", icon: "▣" },
  { to: "/user/my-subscriptions", label: "My Subscriptions", icon: "☷" },
];

const UserLayout = () => <DashboardLayout role="user" links={links} />;

export default UserLayout;
