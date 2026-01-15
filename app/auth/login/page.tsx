"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, LogIn, Car, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  if (session) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-scale-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Already Logged In</h2>
            <p className="text-gray-300 mb-6">Welcome back, {session.user.name}!</p>

            <div className="flex flex-col gap-3">
              <Link href="/listing">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                  <Car className="w-5 h-5" />
                  Explore Vehicles
                </button>
              </Link>
              <button
                onClick={() => {
                  signIn();
                }}
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // Keep redirect false to stay on the page
      });

      if (res?.error) {
        // NextAuth adds error codes to the response
        switch(res.error) {
          case 'CredentialsSignin':
            setError('Invalid email or password. Please try again.');
            break;
          case 'Configuration':
            setError('Authentication configuration error. Please contact support.');
            break;
          case 'AccessDenied':
            setError('Access denied. Please verify your credentials.');
            break;
          case 'Default':
            setError('An authentication error occurred. Please try again.');
            break;
          default:
            setError(res.error || 'Authentication failed. Please try again.');
        }
      }

      if (res?.ok) {
        router.push('/listing');
      }
    } catch (e) {
      setError("An error occurred. Please try again later.");
      console.error("Sign in error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block animate-fade-in">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Rent A Ride
              </span>
            </div>

            <h1 className="h1 text-gray-900 dark:text-white leading-tight">
              Welcome Back to Your
              <span className="block text-blue-600 dark:text-blue-400">
                Journey
              </span>
            </h1>

            <p className="body-large text-gray-600 dark:text-gray-300">
              Sign in to access your account and continue exploring our premium fleet of vehicles.
            </p>

            <div className="space-y-3 pt-4">
              <FeatureItem text="Access exclusive vehicle deals" />
              <FeatureItem text="Manage your bookings easily" />
              <FeatureItem text="Track your rental history" />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-scale-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-800">
            <div className="text-center mb-8">
              <h2 className="h2 text-gray-900 dark:text-white mb-2">Sign In</h2>
              <p className="body-regular text-gray-600 dark:text-gray-400">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-fade-in">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 lift-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link href="/auth/register">
              <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 lift-hover border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
        <CheckCircle className="w-4 h-4 text-white" />
      </div>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}
