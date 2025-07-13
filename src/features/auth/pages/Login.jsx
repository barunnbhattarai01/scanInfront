import React, { useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { auth } from "../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const { signInWithGoogle, loading, error } = useFirebaseAuth();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser.displayName);
      } else {
        console.log("No user logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("Logged in as:", user.displayName);
    }else{
      console.log("failed to log in");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-[90vh] flex max-w-6xl w-full mx-auto rounded-3xl shadow-xl overflow-hidden">

        {/* Left Side */}
        <div className="relative flex-1">
          <img
            src="https://images.unsplash.com/photo-1650488908294-07186d808e5d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="ECMS background"
            className="absolute inset-0 w-full h-full object-cover rounded-l-3xl"
          />
        </div>

        {/* Right Side Login Form */}
        <div className="flex flex-col justify-center flex-1 bg-white p-16 rounded-r-3xl">
          <h1 className="text-center text-5xl mb-15 text-orange-600 font-bold">ECMS</h1>
          <div className="max-w-md mx-auto w-full font-sans">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Login to your Account
              </h1>
              <p className="text-gray-600 text-base">
                See what is going on with your business
              </p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-orange-50 transition mb-6 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Optional error message */}
            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {error.message}
              </p>
            )}

            {/* Separator */}
            <div className="flex items-center text-gray-400 text-sm mb-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4">or Sign in with Email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form className="space-y-8">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
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
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
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
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-orange-500"
                  />
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
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-shadow shadow-md hover:shadow-lg"
              >
                Login
              </button>
            </form>

            <p className="mt-10 text-center text-gray-600 text-sm">
              Not Registered Yet?{" "}
              <a
                href="#"
                className="text-orange-600 hover:underline font-medium"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

