import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../services/BaseURL";
import PageHeader from "../../components/dashboard/PageHeader";

const LIMIT = 10;

const MySubscriptions = () => {
  const { accessToken } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!accessToken) return;

    let ignore = false;
    const controller = new AbortController();

    const fetchEnrollments = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
        });

        const res = await fetch(
          `${baseUrl}/enrollments/?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch enrollments");
        }

        const data = await res.json();

        if (!ignore) {
          setEnrollments(data.items || []);
          setPagination(data.pagination);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("Fetch enrollments error:", error);
          toast.error("Unable to load your subscriptions!");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchEnrollments();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [accessToken, page]);

  const getEnrollmentStatus = (enrollment) => {
    if (enrollment.status === "cancelled") return "cancelled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(`${enrollment.end_date}T00:00:00`);

    if (endDate < today) return "expired";

    return enrollment.status;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "badge-success";

      case "expired":
        return "badge-ghost";

      case "cancelled":
        return "badge-error";

      default:
        return "badge-warning";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredEnrollments = enrollments.filter((item) => {
    const status = getEnrollmentStatus(item);

    return statusFilter === "all" || status === statusFilter;
  });

  return (
    <>
      <PageHeader
        title="My Subscriptions"
        description="Track your current and previous memberships."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          className="select select-bordered w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Subscriptions</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-75">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filteredEnrollments.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredEnrollments.map((item, index) => {
                  const status = getEnrollmentStatus(item);

                  return (
                    <tr key={item.id}>
                      <td>{(page - 1) * LIMIT + index + 1}</td>

                      <td>
                        <div className="font-semibold">
                          Plan #{item.subscription_id}
                        </div>
                      </td>

                      <td>—</td>

                      <td>{formatDate(item.start_date)}</td>

                      <td>{formatDate(item.end_date)}</td>

                      <td>
                        <span
                          className={`badge badge-outline ${getStatusBadge(status)}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <p className="text-sm text-base-content/60">
                Showing page {pagination.page} of {pagination.total_pages} (
                {pagination.total} subscriptions)
              </p>

              <div className="join">
                <button
                  className="join-item btn btn-outline"
                  disabled={!pagination.has_previous || loading}
                  onClick={() => {
                    setLoading(true);
                    setPage((prev) => prev - 1);
                  }}
                >
                  « Previous
                </button>

                <button className="join-item btn btn-active">
                  {pagination.page}
                </button>

                <button
                  className="join-item btn btn-outline"
                  disabled={!pagination.has_next || loading}
                  onClick={() => {
                    setLoading(true);
                    setPage((prev) => prev + 1);
                  }}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold">
            {statusFilter === "all"
              ? "You haven't enrolled in any plans yet."
              : `No ${statusFilter} subscriptions found.`}
          </h3>

          <p className="text-sm text-base-content/60 mt-2">
            Your subscription history will appear here.
          </p>
        </div>
      )}
    </>
  );
};

export default MySubscriptions;
