import React from "react";
import { Car, Users, Shield, Clock, Heart, CheckCircle, Award, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="p-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to <span className="bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">Rent A Ride</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for hassle-free, affordable, and convenient vehicle rentals.
            Whether you need a reliable ride for a day, a week, or longer, we're here to get you moving smoothly and safely.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-700 animate-slide-in">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gray-700 rounded-xl">
              <Target className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                At <span className="font-bold text-gray-300">Rent A Ride</span>, we believe everyone deserves easy access to quality transportation without the stress.
                That's why we offer a wide selection of vehicles, from compact cars perfect for city cruising to spacious SUVs for family trips.
                Our mission is simple: provide flexible rental options, excellent customer service, and competitive prices that keep you on the road with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Rent A Ride?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureBox
              icon={<Car className="w-6 h-6" />}
              title="Variety"
              description="A diverse fleet to suit every need and budget. From bikes to luxury cars, we have it all."
              color="blue"
            />
            <FeatureBox
              icon={<Clock className="w-6 h-6" />}
              title="Convenience"
              description="Quick online booking and flexible pick-up/drop-off locations for your ease."
              color="green"
            />
            <FeatureBox
              icon={<Shield className="w-6 h-6" />}
              title="Reliability"
              description="Well-maintained, clean vehicles you can count on for every journey."
              color="purple"
            />
            <FeatureBox
              icon={<Heart className="w-6 h-6" />}
              title="Customer First"
              description="Friendly support ready to assist you anytime, anywhere."
              color="red"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-12 animate-scale-in">
          <div className="text-center mb-8">
            <Award className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-300 text-lg">
              We're passionate about making your rental experience seamless and enjoyable.
              Whether you're traveling for business, planning a weekend getaway, or need a temporary ride,
              Rent A Ride is here to help you get where you need to go — easily and affordably.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <ValueCard
              icon={<CheckCircle className="w-8 h-8 text-gray-300" />}
              title="Transparency"
              description="No hidden fees, no surprises. What you see is what you get."
            />
            <ValueCard
              icon={<Users className="w-8 h-8 text-gray-300" />}
              title="Community"
              description="Building lasting relationships with our customers and partners."
            />
            <ValueCard
              icon={<Award className="w-8 h-8 text-gray-300" />}
              title="Excellence"
              description="Committed to providing the highest quality service every time."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Thank You for Choosing Rent A Ride
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's hit the road together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/listing">
              <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Browse Vehicles
              </button>
            </a>
            <a href="/auth/register">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-700 transition-all duration-300">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Box Component
function FeatureBox({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: "from-gray-600 to-gray-800",
    green: "from-gray-600 to-gray-800",
    purple: "from-gray-600 to-gray-800",
    red: "from-gray-600 to-gray-800",
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-xl flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// Value Card Component
function ValueCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 backdrop-blur-sm rounded-xl mb-4 border border-gray-600/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
