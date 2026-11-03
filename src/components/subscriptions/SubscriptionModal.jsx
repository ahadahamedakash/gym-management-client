import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../common/Modal";

import { baseUrl } from "../../services/BaseURL";
import { subscriptionSchema } from "../../validation/subscription.schema";
import { useAuth } from "../../hooks/useAuth";

const initialForm = {
  name: "",
  description: "",
  price: "",
  duration_months: "",
  is_active: true,
};

const SubscriptionModal = ({ open, onClose, onSaved, subscription }) => {
  const { accessToken } = useAuth();

  const isEditMode = Boolean(subscription?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: initialForm,
  });

  useEffect(() => {
    if (open) {
      reset(
        isEditMode
          ? {
              name: subscription.name ?? "",
              description: subscription.description ?? "",
              price: Number(subscription.price ?? 0),
              duration_months: Number(subscription.duration_months ?? 1),
              is_active: subscription.is_active ?? true,
            }
          : initialForm,
      );
    }
  }, [subscription, open, reset, isEditMode]);

  const handleFormSubmit = async (data) => {
    try {
      const url = isEditMode
        ? `${baseUrl}/subscriptions/${subscription.id}`
        : `${baseUrl}/subscriptions/`;

      const method = isEditMode ? "PATCH" : "POST";

      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        duration_months: Number(data.duration_months),
      };

      if (isEditMode) {
        payload.is_active = Boolean(data.is_active);
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = res.status === 204 ? null : await res.json();

      if (!res.ok) {
        toast.error(responseData?.detail || "Failed to save subscription!");
        return;
      }

      toast.success(
        isEditMode
          ? "Subscription updated successfully!"
          : "Subscription created successfully!",
      );

      reset(initialForm);
      onSaved();
    } catch (error) {
      console.error("Subscription save error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Update Subscription" : "Create Subscription"}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-4"
      >
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Plan name</legend>

          <input
            type="text"
            placeholder="e.g. Premium Plan"
            className={`input input-bordered w-full ${
              errors.name ? "input-error" : ""
            }`}
            {...register("name")}
          />

          {errors.name && (
            <p className="text-error text-sm">{errors.name.message}</p>
          )}
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description</legend>

          <textarea
            placeholder="Describe this membership..."
            className={`textarea textarea-bordered w-full ${
              errors.description ? "textarea-error" : ""
            }`}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-error text-sm">{errors.description.message}</p>
          )}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Price (৳)</legend>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="1000"
              className={`input input-bordered w-full ${
                errors.price ? "input-error" : ""
              }`}
              {...register("price", { valueAsNumber: true })}
            />

            {errors.price && (
              <p className="text-error text-sm">{errors.price.message}</p>
            )}
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Duration (Months)</legend>

            <input
              type="number"
              min="1"
              step="1"
              placeholder="3"
              className={`input input-bordered w-full ${
                errors.duration_months ? "input-error" : ""
              }`}
              {...register("duration_months", {
                valueAsNumber: true,
              })}
            />

            {errors.duration_months && (
              <p className="text-error text-sm">
                {errors.duration_months.message}
              </p>
            )}
          </fieldset>
        </div>

        {isEditMode && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Subscription Status</legend>

            <select
              className="select select-bordered w-full"
              {...register("is_active", {
                setValueAs: (value) => value === "true",
              })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </fieldset>
        )}

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : isEditMode ? (
              "Update Plan"
            ) : (
              "Create Plan"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionModal;
