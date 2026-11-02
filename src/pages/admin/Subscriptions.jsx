import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Modal from "../../components/common/Modal";
import PageHeader from "../../components/dashboard/PageHeader";
import SubscriptionCard from "../../components/subscriptions/SubscriptionCard";
import SubscriptionModal from "../../components/subscriptions/SubscriptionModal";

import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../services/BaseURL";

const LIMIT = 10;

const Subscriptions = () => {
  const { accessToken } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortby, setSortby] = useState("asc");

  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!accessToken) return;

    let ignore = false;
    const controller = new AbortController();

    const fetchSubscriptions = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          sort_by: sortby,
        });

        if (search) {
          params.set("search", search);
        }

        if (statusFilter !== "all") {
          params.set("is_active", String(statusFilter === "active"));
        }

        const res = await fetch(
          `${baseUrl}/subscriptions/?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        const data = await res.json();

        if (!ignore) {
          setSubscriptions(data.items);
          setPagination(data.pagination);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("Fetch subscriptions error:", error);
          toast.error("Unable to load subscriptions!");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSubscriptions();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [accessToken, page, search, statusFilter, refresh, sortby]);

  const handleCreate = () => {
    setSelectedSubscription(null);
    setModalOpen(true);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription(subscription);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSubscription(null);
  };

  const handleSaveSuccess = () => {
    handleModalClose();
    setLoading(true);
    setRefresh((prev) => prev + 1);
  };

  const handleDelete = (subscription) => {
    setSubscriptionToDelete(subscription);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    if (deleting) return;

    setDeleteModalOpen(false);
    setSubscriptionToDelete(null);
  };

  const confirmDelete = async () => {
    if (!subscriptionToDelete || deleting) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${baseUrl}/subscriptions/${subscriptionToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json();

        toast.error(errorData?.detail || "Failed to delete subscription!");

        return;
      }

      toast.success("Subscription deleted successfully!");

      setDeleteModalOpen(false);
      setSubscriptionToDelete(null);

      if (subscriptions.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        setLoading(true);
        setRefresh((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Delete subscription error:", error);
      toast.error("Something went wrong!");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setSortby("asc");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Create and manage gym membership packages."
        action={
          <button onClick={handleCreate} className="btn btn-success">
            + Create Plan
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search subscriptions..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full sm:max-w-xs"
        />

        <select
          value={sortby}
          onChange={(e) => {
            setSortby(e.target.value);
            setPage(1);
            setLoading(true);
          }}
          className="select select-bordered w-full sm:w-44"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select select-bordered w-full sm:w-44"
        >
          <option value="all">All Plans</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {(searchInput || statusFilter !== "all" || sortby !== "asc") && (
          <button onClick={handleClearFilters} className="btn btn-ghost">
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-75">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : subscriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                mode="admin"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
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
          <h3 className="text-lg font-semibold">No subscriptions found</h3>

          <p className="text-sm text-base-content/60 mt-2">
            {search || statusFilter !== "all"
              ? "Try changing your search or filters."
              : "Create your first membership plan."}
          </p>

          {(search || statusFilter !== "all") && (
            <button
              onClick={handleClearFilters}
              className="btn btn-outline btn-sm mt-4"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <SubscriptionModal
        open={modalOpen}
        onClose={handleModalClose}
        onSaved={handleSaveSuccess}
        subscription={selectedSubscription}
      />

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        title="Delete Subscription"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-error/10 text-error rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <div>
              <h3 className="font-semibold text-base">Are you sure?</h3>

              <p className="text-sm text-base-content/60">
                You are about to delete this subscription.
              </p>
            </div>
          </div>

          {subscriptionToDelete && (
            <div className="bg-base-200 rounded-lg p-4">
              <p className="font-semibold">{subscriptionToDelete.name}</p>

              <p className="text-sm text-base-content/60 mt-1">
                Price: ৳{subscriptionToDelete.price}
              </p>
            </div>
          )}

          <p className="text-sm text-base-content/70">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              disabled={deleting}
              onClick={handleDeleteModalClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-error"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Subscriptions;
