import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const DashboardLayout = ({ role, links }) => {
  const navigate = useNavigate();

  const { logout, authUser } = useAuth();

  const isAdmin = authUser?.role === "admin";

  const handleLogout = async () => {
    await logout();

    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-w-0">
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost"
            >
              ☰
            </label>
          </div>

          <div className="flex-1">
            <span className="font-bold text-lg">
              Fl<span className="text-primary">exio</span>
            </span>
          </div>

          <div className="flex-none flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Welcome back!</p>
              <p className="text-xs text-base-content/60 capitalize">{role}</p>
            </div>

            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8 pl-2 pt-1">
                <span>{isAdmin ? "A" : "U"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 flex-1 min-w-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />

        <aside className="bg-base-100 w-72 min-h-full border-r border-base-300 flex flex-col">
          <div className="p-6 border-b border-base-300">
            <h2 className="font-bold text-xl">Flexio</h2>
            <p className="text-xs text-base-content/50 mt-1">
              {isAdmin ? "Administration Panel" : "Member Portal"}
            </p>
          </div>

          <nav className="p-4 flex-1">
            <p className="text-xs uppercase font-semibold text-base-content/40 mb-3">
              Menu
            </p>

            <ul className="menu gap-1 p-0">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      isActive ? "active font-semibold" : ""
                    }
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-base-300">
            <button
              onClick={handleLogout}
              className="btn btn-block justify-start text-error"
            >
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
