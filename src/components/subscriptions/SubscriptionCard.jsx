const SubscriptionCard = ({
  subscription,
  mode = "user",
  onEdit,
  onDelete,
  onEnroll,
}) => {
  const {
    name,
    description,
    price,
    duration_months,
    is_active = true,
  } = subscription;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className="card-title text-lg">{name}</h2>
            <p className="text-sm text-base-content/60 mt-1">
              {duration_months} months membership
            </p>
          </div>

          <span
            className={`badge ${
              is_active ? "badge-success" : "badge-error"
            } badge-outline`}
          >
            {is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold">
            ৳{Number(price).toLocaleString("en-BD")}
          </span>
          {/* <span className="text-sm text-base-content/50">
            {" "}
            / {duration_months} days
          </span> */}
        </div>

        <p className="text-sm text-base-content/70">{description}</p>

        <div className="card-actions mt-5">
          {mode === "admin" ? (
            <>
              <button
                onClick={() => onEdit?.(subscription)}
                className="btn btn-outline btn-sm flex-1"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete?.(subscription)}
                className="btn btn-error btn-outline btn-sm"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onEnroll?.(subscription)}
              disabled={status !== "active"}
              className="btn btn-primary btn-block"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
