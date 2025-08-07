import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
// import { baseApiUrl } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const newErrors: typeof errors = {};

    if (!identifier.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login({ email: identifier, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ general: "Login failed. Please check your credentials and try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 relative z-10">
      <div className="bg-white shadow-lg rounded-md px-6 py-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-blue-800">Clinico</h1>
        </div>

        <h2 className="text-lg font-semibold mb-4">Sign In to Clinico</h2>

        {errors.general && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded text-sm mb-4">
            {errors.general}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email address</label>
          <Input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full"
            placeholder="e.g. user@example.com"
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="mb-2">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            placeholder="Enter password"
          />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <label className="text-sm">Show Password</label>
          </div>
        </div>

        <div className="mt-2 mb-4 flex justify-between items-center">
          <Button
            className="text-sm text-teal-500 hover:underline"
            onClick={() => navigate("/forgot-password")}
            variant="link"
          >
            Forgot Password
          </Button>
          <Button
            onClick={handleSignIn}
            className="bg-blue-800 text-white px-6 py-1 text-sm hover:bg-blue-700"
          >
            SIGN IN
          </Button>
        </div>

        <hr className="my-4" />

      </div>
    </div>
  );
}