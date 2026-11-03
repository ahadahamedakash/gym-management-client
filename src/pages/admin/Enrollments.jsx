import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";

import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../services/BaseURL";

const LIMIT = 10;

const Enrollments = () => {
  const { accessToken } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
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

        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }

        const res = await fetch(
          `${baseUrl}/enrollments/admin/?${params.toString()}`,
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
          setEnrollments(data.items);
          setPagination(data.pagination);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("Fetch enrollments error:", error);
          toast.error("Unable to load enrollments!");
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
  }, [accessToken, page, statusFilter]);

  const formatDate = (dateString) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "badge-success",
      expired: "badge-warning",
      cancelled: "badge-error",
    };

    return (
      <span
        className={`badge badge-soft ${styles[status] || "badge-ghost"} capitalize`}
      >
        {status}
      </span>
    );
  };

  const handleFilterChange = (e) => {
    setLoading(true);
    setPage(1);
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  return (
    <>
      <PageHeader
        title="Enrollments"
        description="View and manage gym membership enrollments."
      />

      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div>
          <h3 className="font-semibold text-lg">All Enrollments</h3>

          {pagination && (
            <p className="text-sm text-base-content/60 mt-1">
              Total {pagination.total} enrollments
            </p>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={handleFilterChange}
          className="select select-bordered w-full sm:w-48"
        >
          <option value="all">All Enrollments</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          {/* <option value="cancelled">Cancelled</option> */}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-75">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : enrollments.length > 0 ? (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Subscription</th>
                  <th>Price</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="font-medium">#{enrollment.id}</td>

                    <td>
                      <div className="font-semibold">
                        {enrollment.user?.name || "Unknown"}
                      </div>

                      <div className="text-xs text-base-content/60">
                        {enrollment.user?.email || "No email"}
                      </div>
                    </td>

                    <td>
                      <div className="font-medium">
                        {enrollment.subscription?.name || "Unknown"}
                      </div>

                      <div className="text-xs text-base-content/60">
                        {enrollment.subscription?.duration_months} months
                      </div>
                    </td>

                    <td className="font-medium whitespace-nowrap">
                      ৳
                      {Number(
                        enrollment.subscription?.price || 0,
                      ).toLocaleString("en-BD")}
                    </td>

                    <td className="whitespace-nowrap">
                      {formatDate(enrollment.start_date)}
                    </td>

                    <td className="whitespace-nowrap">
                      {formatDate(enrollment.end_date)}
                    </td>

                    <td>{getStatusBadge(enrollment.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <p className="text-sm text-base-content/60">
                Showing page {pagination.page} of {pagination.total_pages} (
                {pagination.total} enrollments)
              </p>

              <div className="join">
                <button
                  className="join-item btn btn-outline"
                  disabled={!pagination.has_previous || loading}
                  onClick={() => handlePageChange(page - 1)}
                >
                  « Previous
                </button>

                <button className="join-item btn btn-active">
                  {pagination.page}
                </button>

                <button
                  className="join-item btn btn-outline"
                  disabled={!pagination.has_next || loading}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300">
          <h3 className="text-lg font-semibold">No enrollments found</h3>

          <p className="text-sm text-base-content/60 mt-2">
            {statusFilter !== "all"
              ? `No ${statusFilter} enrollments available.`
              : "There are no enrollments yet."}
          </p>

          {statusFilter !== "all" && (
            <button
              onClick={() => {
                setLoading(true);
                setPage(1);
                setStatusFilter("all");
              }}
              className="btn btn-outline btn-sm mt-4"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Enrollments;
