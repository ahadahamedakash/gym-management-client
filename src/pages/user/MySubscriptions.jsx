import PageHeader from "../../components/dashboard/PageHeader";
import { mockSubscriptions } from "../../data/mockData";

const mockEnrollments = [
  {
    id: 101,
    subscriptionId: 2,
    startDate: "2026-10-01",
    endDate: "2026-12-29",
    status: "active",
  },
  {
    id: 102,
    subscriptionId: 1,
    startDate: "2026-06-01",
    endDate: "2026-07-01",
    status: "expired",
  },
];

const MySubscriptions = () => {
  const mySubscriptions = mockEnrollments
    .map((enrollment) => ({
      ...enrollment,
      plan: mockSubscriptions.find(
        (plan) => plan.id === enrollment.subscriptionId,
      ),
    }))
    .filter((item) => item.plan);

  return (
    <>
      <PageHeader
        title="My Subscriptions"
        description="Track your current and previous memberships."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {mySubscriptions.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 border border-base-300 shadow-sm"
          >
            <div className="card-body">
              <div className="flex justify-between items-center gap-2">
                <h2 className="card-title">{item.plan.name}</h2>

                <span
                  className={`badge ${
                    item.status === "active" ? "badge-success" : "badge-ghost"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-2xl font-bold mt-3">
                ৳{item.plan.price.toLocaleString("en-BD")}
              </p>

              <div className="divider my-1" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Start date</span>
                  <span>{item.startDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">End date</span>
                  <span>{item.endDate}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-base-content/60">Duration</span>
                  <span>{item.plan.duration} days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mySubscriptions.length === 0 && (
        <div className="text-center py-16">
          <h3 className="font-semibold text-lg">
            You haven't enrolled in any plans yet.
          </h3>
        </div>
      )}
    </>
  );
};

export default MySubscriptions;
