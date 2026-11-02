import { Link, useNavigate } from "react-router";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth.schema";

const Signup = () => {
  const navigate = useNavigate();

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data) => {
    try {
      await registerUser({ ...data, role: "admin" });

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(error.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-8">
      <form
        onSubmit={handleSubmit(handleRegister)}
        noValidate
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-content">
            Create an account
          </h1>

          <p className="text-base-content/60 mt-2">
            Get started by creating your account.
          </p>
        </div>

        <fieldset className="fieldset">
          <label className="label text-base-content">Username</label>

          <input
            type="text"
            placeholder="Enter username"
            className={`input input-bordered w-full ${
              errors.username ? "input-error" : ""
            }`}
            {...register("username")}
          />

          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="label text-base-content">First Name</label>

              <input
                type="text"
                placeholder="First name"
                className={`input input-bordered w-full ${
                  errors.firstname ? "input-error" : ""
                }`}
                {...register("firstname")}
              />

              {errors.firstname && (
                <p className="text-error text-sm mt-1">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label className="label text-base-content">Last Name</label>

              <input
                type="text"
                placeholder="Last name"
                className={`input input-bordered w-full ${
                  errors.lastname ? "input-error" : ""
                }`}
                {...register("lastname")}
              />

              {errors.lastname && (
                <p className="text-error text-sm mt-1">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          <label className="label text-base-content mt-3">Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : ""
            }`}
            {...register("email")}
          />

          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}

          <label className="label text-base-content mt-3">Password</label>

          <input
            type="password"
            placeholder="Enter password"
            className={`input input-bordered w-full ${
              errors.password ? "input-error" : ""
            }`}
            {...register("password")}
          />

          {errors.password && (
            <p className="text-error text-sm">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-soft btn-success w-full mt-6"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </fieldset>

        <p className="text-center text-sm text-base-content/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
