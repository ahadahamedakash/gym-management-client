import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";

const UserDashboard = () => {
  return (
    <>
      <PageHeader
        title="My Dashboard"
        description="Welcome to your gym membership portal."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          title="Active Memberships"
          value="1"
          description="Currently active"
          icon="✓"
        />

        <StatCard
          title="Available Plans"
          value="8"
          description="Explore membership options"
          icon="▣"
        />

        <StatCard
          title="Previous Memberships"
          value="2"
          description="Your membership history"
          icon="☷"
        />
      </div>

      <div className="card bg-base-100 border border-base-300 mt-8">
        <div className="card-body">
          <h2 className="font-bold text-lg">Your Membership</h2>

          <p className="text-sm text-base-content/60">
            Your active membership information will appear here.
          </p>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
