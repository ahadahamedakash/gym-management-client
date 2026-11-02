const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-base-content/60 mt-1">{description}</p>
      </div>

      {action}
    </div>
  );
};

export default PageHeader;
