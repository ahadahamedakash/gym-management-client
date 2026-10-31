import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../services/BaseURL";
import { AuthContext } from "../context/AuthContext";

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("gm_access_token"),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      if (!accessToken) {
        setAuthUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(`${baseUrl}/auth/user-details`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const userData = await response.json();
        setAuthUser(userData);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Authentication error:", error);

        localStorage.removeItem("gm_access_token");
        setAccessToken(null);
        setAuthUser(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => controller.abort();
  }, [accessToken]);

  const login = (token, user) => {
    localStorage.setItem("gm_access_token", token);
    setAccessToken(token);
    setAuthUser(user);
  };

  const logout = () => {
    localStorage.removeItem("gm_access_token");
    setAccessToken(null);
    setAuthUser(null);
  };

  const register = async (data) => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        responseData?.detail ||
          responseData?.message ||
          "Registration failed. Please try again.",
      );
    }

    return responseData;
  };

  const authValue = useMemo(
    () => ({
      authUser,
      accessToken,
      loading,
      login,
      logout,
      register,
    }),
    [authUser, accessToken, loading],
  );

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
