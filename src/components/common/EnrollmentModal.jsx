import Modal from "../common/Modal";

const EnrollmentModal = ({
  open,
  onClose,
  subscription,
  onConfirm,
  loading = false,
}) => {
  if (!subscription) return null;

  return (
    <Modal open={open} onClose={onClose} title="Confirm Enrollment">
      <div className="space-y-4">
        <div className="bg-base-200 rounded-xl p-4">
          <h3 className="font-bold text-lg">{subscription.name}</h3>

          <p className="text-sm text-base-content/60 mt-1">
            {subscription.description}
          </p>

          <div className="flex justify-between mt-4">
            <span className="text-sm">Membership price</span>
            <span className="font-bold">
              ৳{subscription.price.toLocaleString("en-BD")}
            </span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-sm">Duration</span>
            <span className="font-semibold">{subscription.duration} days</span>
          </div>
        </div>

        <p className="text-sm text-base-content/60">
          Are you sure you want to enroll in this membership?
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Processing..." : "Confirm Enrollment"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EnrollmentModal;
