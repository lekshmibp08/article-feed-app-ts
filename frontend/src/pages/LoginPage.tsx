import configAxios from "../services/axiosConfig";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { loginSuccess } from "../redux/slices/authSlice";
import { LoginFormData } from "../types/types";
import { loginUser } from "../api/userApi";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = tab === "email"
      ? { email: formData.email, password: formData.password }
      : { phone: formData.phone, password: formData.password };

    try {
      const response = await loginUser(payload);
      const { token, userData } = response.data;
      dispatch(loginSuccess({ user: userData, token }));
      navigate("/dashboard", { replace: true });

    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-gray-500 text-sm mb-4">Enter your credentials to access your account</p>


        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`w-1/2 py-2 text-center ${
              tab === "email" ? "border-b-2 border-black font-medium" : "text-gray-500"
            }`}
            onClick={() => setTab("email")}
          >
            Email
          </button>
          <button
            className={`w-1/2 py-2 text-center ${
              tab === "phone" ? "border-b-2 border-black font-medium" : "text-gray-500"
            }`}
            onClick={() => setTab("phone")}
          >
            Phone
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">

        {tab === "email" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>   

        

        {/* Sign In Button */}
        <button 
          className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-black font-medium underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
