import { useState, useEffect } from "react";

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // Animate in
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) {
      // Small delay so the backdrop renders first, then the card slides in
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const authUrl = import.meta.env.VITE_AUTH_URL || "http://localhost:8000";
    const endpoint = mode === "login" ? "/api/login" : "/api/register";

    try {
      const res = await fetch(`${authUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
        }
        throw new Error(data.message || "Authentication failed.");
      }

      // Success! Store token and close modal
      localStorage.setItem("userToken", data.token);
      if (data.user) {
        localStorage.setItem("userName", data.user.name);
      }
      onSuccess?.(data);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300); // Wait for animation to finish
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setFormData({ name: "", email: "", password: "", password_confirmation: "" });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      />

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
        >
          <svg className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-8 pt-10 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tighter">ZENZLOOM</span>
          </div>

          <h2 className="text-3xl font-black tracking-tighter mt-6">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login"
              ? "Sign in to continue shopping."
              : "Join Zenzloom for a premium thrift experience."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 mt-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                mode === "login" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                mode === "register" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-shake">
              {error}
            </div>
          )}

          {/* Name (register only) */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
              required={mode === "register"}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
              required
            />
          </div>

          {/* Confirm Password (register only) */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-sm"
              required={mode === "register"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Secure Authentication
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
