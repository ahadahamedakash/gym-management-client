import { useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import SubscriptionCard from "../../components/subscriptions/SubscriptionCard";
import { mockSubscriptions } from "../../data/mockData";
import EnrollmentModal from "../../components/common/EnrollmentModal";

const AvailableSubscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const subscriptions = mockSubscriptions.filter(
    (item) => item.status === "active",
  );

  const handleEnroll = async () => {
    if (!selectedPlan) return;

    setLoading(true);

    try {
      // TODO: POST /api/enrollments
      console.log("Enrollment requested:", selectedPlan.id);

      alert("Enrollment request submitted!");
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Available Plans"
        description="Choose a membership plan that fits your fitness goals."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            mode="user"
            onEnroll={setSelectedPlan}
          />
        ))}
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-16">
          <h3 className="font-semibold text-lg">No plans available</h3>
          <p className="text-sm text-base-content/60 mt-2">
            Please check back later.
          </p>
        </div>
      )}

      <EnrollmentModal
        open={Boolean(selectedPlan)}
        subscription={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onConfirm={handleEnroll}
        loading={loading}
      />
    </>
  );
};

export default AvailableSubscriptions;
