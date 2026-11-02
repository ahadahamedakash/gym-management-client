import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import SubscriptionCard from "../../components/subscriptions/SubscriptionCard";

import { useAuth } from "../../hooks/useAuth";
import { baseUrl } from "../../services/BaseURL";

const LIMIT = 10;

const AvailableSubscriptions = () => {
  const { accessToken } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [pendingSubscription, setPendingSubscription] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

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

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(LIMIT),
          is_active: "true",
        });

        if (search) {
          params.set("search", search);
        }

        const [subscriptionRes, statusRes] = await Promise.all([
          fetch(`${baseUrl}/subscriptions/?${params.toString()}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),

          fetch(`${baseUrl}/enrollments/status`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }),
        ]);

        if (!subscriptionRes.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        if (!statusRes.ok) {
          throw new Error("Failed to fetch enrollment status");
        }

        const subscriptionData = await subscriptionRes.json();
        const statusData = await statusRes.json();

        if (!ignore) {
          setSubscriptions(subscriptionData.items || []);
          setPagination(subscriptionData.pagination);

          setEnrolledIds(statusData.enrolled_subscription_ids || []);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !ignore) {
          console.error("Fetch data error:", error);
          toast.error("Unable to load subscriptions!");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [accessToken, page, search]);

  const handleEnroll = (subscription) => {
    if (enrolledIds.includes(subscription.id)) {
      toast.error("You are already enrolled in this plan!");
      return;
    }

    setPendingSubscription(subscription);
  };

  const confirmEnrollment = async () => {
    if (!pendingSubscription || !accessToken || enrollingId !== null) {
      return;
    }

    const subscription = pendingSubscription;

    try {
      setEnrollingId(subscription.id);

      const res = await fetch(`${baseUrl}/enrollments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          subscription_id: subscription.id,
        }),
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.status === 409) {
        setEnrolledIds((prev) =>
          prev.includes(subscription.id) ? prev : [...prev, subscription.id],
        );

        toast.error(
          responseData.detail ||
            "You are already enrolled in this subscription!",
        );

        setPendingSubscription(null);
        return;
      }

      if (!res.ok) {
        toast.error(
          responseData.detail || "Failed to enroll. Please try again!",
        );
        return;
      }

      setEnrolledIds((prev) =>
        prev.includes(subscription.id) ? prev : [...prev, subscription.id],
      );

      toast.success("Enrollment successful!");

      setPendingSubscription(null);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setEnrollingId(null);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    setLoading(true);
  };

  const handleCloseModal = () => {
    if (enrollingId !== null) return;

    setPendingSubscription(null);
  };

  return (
    <>
      <PageHeader
        title="Available Subscriptions"
        description="Explore membership plans and enroll in your preferred plan."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search subscriptions..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
            setLoading(true);
          }}
          className="input input-bordered w-full sm:max-w-xs"
        />

        {searchInput && (
          <button onClick={handleClearSearch} className="btn btn-ghost">
            Clear Search
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
                mode="user"
                isEnrolled={enrolledIds.includes(subscription.id)}
                enrolling={enrollingId === subscription.id}
                onEnroll={handleEnroll}
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
            {search
              ? "Try changing your search."
              : "There are no available subscription plans right now."}
          </p>

          {search && (
            <button
              onClick={handleClearSearch}
              className="btn btn-outline btn-sm mt-4"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {pendingSubscription && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="text-xl font-bold">Confirm Enrollment</h3>

            <p className="py-4 text-base-content/70">
              Are you sure you want to enroll in this subscription?
            </p>

            <div className="bg-base-200 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-lg">
                {pendingSubscription.name}
              </h4>

              <p className="text-sm text-base-content/70">
                {pendingSubscription.description}
              </p>

              <div className="flex justify-between pt-2">
                <span>Price</span>
                <span className="font-semibold">
                  ৳{pendingSubscription.price}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-semibold">
                  {pendingSubscription.duration_months} Months
                </span>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                disabled={enrollingId !== null}
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                disabled={enrollingId !== null}
                onClick={confirmEnrollment}
              >
                {enrollingId !== null ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Enrolling...
                  </>
                ) : (
                  "Confirm Enrollment"
                )}
              </button>
            </div>
          </div>

          <div className="modal-backdrop">
            <button onClick={handleCloseModal} disabled={enrollingId !== null}>
              close
            </button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default AvailableSubscriptions;
