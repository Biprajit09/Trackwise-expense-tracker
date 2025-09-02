"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      setError(error.message);
    } else {
      console.log("Login successful:", data);

      // ✅ Force refresh session
      await supabase.auth.getSession();

      // ✅ Redirect to profile
      router.push("/profile");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#F0F4F8] px-6 gap-10 py-16">
      {/* SVG Illustration */}
      <div className="md:w-1/2 flex justify-center">
        <img
          src="/undraw_secure-login_m11a.svg"
          alt="Secure Login Illustration"
          className="w-80 h-auto"
        />
      </div>

      {/* Login Form */}
      <div className="md:w-1/2 bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

           <div>
      <label className="block text-gray-700 mb-2 font-medium">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-70"
>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

