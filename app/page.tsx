import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Car, Shield, Clock, Star, ArrowRight, Zap, Users, Award } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              {/* <div className="inline-block">
                <span className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                  🚗 Your Journey Starts Here
                </span>
              </div> */}

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Rent Your
                <span className="block text-blue-600 dark:text-blue-400">
                  Dream Ride
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                Experience the freedom of the open road with our premium fleet of vehicles.
                From economy to luxury, we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/listing">
                  <button className="group px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all duration-200 lift-hover flex items-center justify-center gap-2">
                    Explore Vehicles
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                {!session && (
                  <Link href="/auth/register">
                    <button className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 lift-hover flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700">
                      List Your Vehicle
                      <Car className="w-5 h-5" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Vehicles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.9★</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
              <div className="relative rounded-3xl shadow-xl lift-hover border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Image
                  src="/a2be3940-e748-45e5-bd83-c9a4e304224c.png"
                  alt="Premium vehicle collection"
                  width={600}
                  height={500}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 text-gray-900 dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide the best car rental experience with unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Instant Booking"
              description="Book your vehicle in seconds with our streamlined process"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Secure & Safe"
              description="All vehicles are insured and thoroughly maintained"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="24/7 Support"
              description="Round-the-clock customer support for your convenience"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
              title="Best Prices"
              description="Competitive rates with no hidden fees"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="h2 text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="body-large text-gray-600 dark:text-gray-300">
              Get on the road in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Choose Your Vehicle"
              description="Browse our wide selection of cars, bikes, and pickups"
              icon={<Car className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
            />
            <StepCard
              number="2"
              title="Book Instantly"
              description="Select your dates and complete the booking in minutes"
              icon={<Clock className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
            />
            <StepCard
              number="3"
              title="Hit the Road"
              description="Pick up your vehicle and start your adventure"
              icon={<Star className="w-12 h-12 text-blue-600 dark:text-blue-400" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="h2 text-gray-900 dark:text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="body-large text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of satisfied customers who trust us for their transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listing">
              <button className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all duration-200 lift-hover">
                Browse Vehicles
              </button>
            </Link>
            {!session && (
              <Link href="/auth/register">
                <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 lift-hover border border-gray-300 dark:border-gray-700">
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
function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 lift-hover border border-gray-200 dark:border-gray-800">
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="h4 text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 lift-hover border border-gray-200 dark:border-gray-800">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {number}
          </div>
        </div>
        <div className="mt-8 mb-4 text-center">
          {icon}
        </div>
        <h3 className="h4 text-gray-900 dark:text-white mb-3 text-center">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">{description}</p>
      </div>
    </div>
  );
}
