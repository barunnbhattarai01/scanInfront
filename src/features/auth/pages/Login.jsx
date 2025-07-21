import React from "react";
import { Mail, Lock } from "lucide-react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithGoogle, loading, error } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("Logged in as:", user.displayName);
      navigate("/", { replace: true });
    } else {
      console.log("failed to log in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="relative md:flex-1 hidden md:block">
          <img
            src="img/landings.jpg"
            alt="Landing"
            className="absolute inset-0 w-full h-full object-center"
          />
        </div>

        {/* Right Side Login Form */}
        <div className="flex flex-1 flex-col justify-center p-8 sm:p-12 md:p-16">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-orange-500 md:hidden mb-2">
                ECMS
              </h1>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Login to your Account
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                See what is going on with your business
              </p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-orange-50 transition mb-6 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {error.message}
              </p>
            )}

            {/* Separator */}
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3">or Sign in with Email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Email Login */}
            <form className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mail@abc.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition"
                />
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-orange-500" />
                  Remember Me
                </label>
                <a
                  href="#"
                  className="text-orange-600 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center text-gray-700 text-sm font-semibold">
              Powered by OCS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
