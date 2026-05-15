import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("userToken", token);
      // Redirect to checkout or intended page
      navigate("/checkout");
    } else {
      // If no token, redirect home
      navigate("/");
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-bold uppercase">Authenticating...</h2>
    </div>
  );
};

export default AuthCallback;
