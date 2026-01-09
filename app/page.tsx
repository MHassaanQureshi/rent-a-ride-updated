import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Car, Shield, Clock, Star, ArrowRight, Zap, Users, Award } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-gray-600">
                  🚗 Your Journey Starts Here
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Rent Your
                <span className="block bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
                  Dream Ride
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                Experience the freedom of the open road with our premium fleet of vehicles.
                From economy to luxury, we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/listing">
                  <button className="group px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    Explore Vehicles
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                {!session && (
                  <Link href="/auth/register">
                    <button className="px-8 py-4 bg-gray-900 border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 flex items-center justify-center gap-2">
                      List Your Vehicle
                      <Car className="w-5 h-5" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-gray-400 text-sm">Vehicles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-gray-400 text-sm">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">4.9★</div>
                  <div className="text-gray-400 text-sm">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500 border-4 border-white/20 overflow-hidden">
                <div className="bg-gray-800 w-full h-96 md:h-full flex items-center justify-center rounded-3xl">
                  <div className="text-center">
                    <Car className="w-24 h-24 mx-auto text-gray-600" />
                    <p className="mt-4 text-gray-500">Premium Vehicle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide the best car rental experience with unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-gray-300" />}
              title="Instant Booking"
              description="Book your vehicle in seconds with our streamlined process"
              color="gray"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-gray-300" />}
              title="Secure & Safe"
              description="All vehicles are insured and thoroughly maintained"
              color="gray"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-gray-300" />}
              title="24/7 Support"
              description="Round-the-clock customer support for your convenience"
              color="gray"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-gray-300" />}
              title="Best Prices"
              description="Competitive rates with no hidden fees"
              color="gray"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Get on the road in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Choose Your Vehicle"
              description="Browse our wide selection of cars, bikes, and pickups"
              icon={<Car className="w-12 h-12 text-gray-300" />}
            />
            <StepCard
              number="2"
              title="Book Instantly"
              description="Select your dates and complete the booking in minutes"
              icon={<Clock className="w-12 h-12 text-gray-300" />}
            />
            <StepCard
              number="3"
              title="Hit the Road"
              description="Pick up your vehicle and start your adventure"
              icon={<Star className="w-12 h-12 text-gray-300" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust us for their transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listing">
              <button className="px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Browse Vehicles
              </button>
            </Link>
            {!session && (
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-gray-900 border-2 border-gray-600 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300">
                  Become a Provider
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    gray: 'from-gray-600 to-gray-800',
  };

  return (
    <div className="group p-6 bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-300">
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description, icon }: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="bg-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-300">
        <div className="absolute -top-6 left-8">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {number}
          </div>
        </div>
        <div className="mt-6 mb-4 text-gray-700">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
