const StatCard = ({ title, value, description, icon }) => {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-base-content/60">{title}</p>
          <span className="text-2xl">{icon}</span>
        </div>

        <h2 className="text-3xl font-bold">{value}</h2>

        <p className="text-xs text-base-content/50">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
