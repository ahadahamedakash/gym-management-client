import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";

const AdminDashboard = () => {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your gym management system."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value="245"
          description="Registered members"
          icon="♙"
        />
        <StatCard
          title="Active Members"
          value="182"
          description="Currently active memberships"
          icon="✓"
        />
        <StatCard
          title="Subscription Plans"
          value="8"
          description="Available membership plans"
          icon="▣"
        />
        <StatCard
          title="Enrollments"
          value="32"
          description="This month"
          icon="☷"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="font-bold text-lg">Recent Activity</h2>
            <p className="text-sm text-base-content/50">
              Recent member registrations and enrollments will appear here.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h2 className="font-bold text-lg">Membership Overview</h2>
            <p className="text-sm text-base-content/50">
              Membership statistics will appear here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
