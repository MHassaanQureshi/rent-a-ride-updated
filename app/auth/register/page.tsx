"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, Car, Eye, EyeOff, ArrowRight, UserPlus, CheckCircle } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (formData.role === "provider") {
          router.push("/add-vehicles");
        } else {
          router.push("/auth/login");
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (e) {
      setError("An error occurred. Please try again later.");
      console.log("error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // If already registered as provider
  if (session?.user.role === "provider") {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-scale-in">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Already Registered</h2>
            <p className="text-gray-300 mb-6">You're already registered as a provider!</p>

            <Link href="/dashboard/provider">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                <Car className="w-5 h-5" />
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Join Our Growing
              <span className="block text-blue-600 dark:text-blue-400">
                Community
              </span>
            </h1>

            <p className="body-large text-gray-600 dark:text-gray-300">
              Create your account and start your journey with us. Rent vehicles or become a provider today!
            </p>

            <div className="space-y-3 pt-4">
              <FeatureItem text="Quick and easy registration" />
              <FeatureItem text="Access to premium vehicles" />
              <FeatureItem text="Flexible rental options" />
              <FeatureItem text="24/7 customer support" />
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="animate-scale-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-800">
            <div className="text-center mb-8">
              <h2 className="h2 text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="body-regular text-gray-600 dark:text-gray-400">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    onChange={handleChange}
                    name="name"
                    value={formData.name}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

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
                    onChange={handleChange}
                    name="email"
                    value={formData.email}
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
                    placeholder="Create a strong password"
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
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

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    onChange={handleChange}
                    name="phone"
                    value={formData.phone}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="123 Main St, City, State"
                    onChange={handleChange}
                    name="address"
                    value={formData.address}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.role === "user"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${formData.role === "user" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                    <div className={`font-semibold ${formData.role === "user" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                      User
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rent vehicles</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "provider" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.role === "provider"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                        : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                  >
                    <Car className={`w-6 h-6 mx-auto mb-2 ${formData.role === "provider" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`} />
                    <div className={`font-semibold ${formData.role === "provider" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                      Provider
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">List vehicles</div>
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
                disabled={isLoading || !formData.role}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 lift-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/auth/login">
              <button className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 lift-hover border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2">
                Sign In
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
