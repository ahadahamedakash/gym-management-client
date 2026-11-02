import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/auth.schema";
import { baseUrl } from "../../services/BaseURL";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const responseData = await res.json();
      const accessToken = responseData?.access_token;

      if (!accessToken) {
        toast.error("Login failed. Please try again!");
        return;
      }

      const userRes = await fetch(`${baseUrl}/auth/user-details`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userRes.ok) {
        toast.error("Unable to retrieve user information!");
        return;
      }

      const userData = await userRes.json();

      if (userData?.id) {
        login(accessToken, userData);

        toast.success("Login successful!");

        if (userData?.role === "user") {
          navigate("/user");
        } else if (userData?.role === "admin") {
          navigate("/admin");
        }
      } else {
        toast.error("Unable to verify user!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <form
        onSubmit={handleSubmit(handleLogin)}
        noValidate
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-base-content">Welcome back</h1>
          <p className="text-base-content/60 mt-2">
            Please enter your details to sign in.
          </p>
        </div>

        <fieldset className="fieldset">
          <label className="label text-base-content">Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            className={`input input-bordered w-full ${
              errors.username ? "input-error" : ""
            }`}
            {...register("username")}
          />

          {errors.username && (
            <p className="text-error text-sm">{errors.username.message}</p>
          )}

          <div className="flex items-center justify-between mt-3">
            <label className="label text-base-content">Password</label>

            <Link to="/forgot-password" className="link link-primary text-sm">
              Forgot password?
            </Link>
          </div>

          <input
            type="password"
            placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </fieldset>

        <p className="text-center text-sm text-base-content/60 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
