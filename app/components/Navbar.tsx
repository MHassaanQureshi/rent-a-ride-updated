"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, Car, User, LogIn, UserPlus, LayoutDashboard, Plus } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-blue-500 rounded-xl group-hover:shadow-lg transition-all duration-300 lift-hover">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rent A Ride
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/about" icon={null}>About</NavLink>
            <NavLink href="/listing" icon={<Car className="w-4 h-4" />}>Vehicles</NavLink>

            {!session ? (
              <>
                <NavLink href="/auth/login" icon={<LogIn className="w-4 h-4" />}>Login</NavLink>
                <Link href="/auth/register">
                  <button className="ml-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 lift-hover flex items-center gap-2 font-medium">
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <NavLink href="/add-vehicles" icon={<Plus className="w-4 h-4" />}>Add Vehicle</NavLink>
                {session.user.role === "provider" && (
                  <NavLink href="/dashboard/provider" icon={<LayoutDashboard className="w-4 h-4" />}>Provider</NavLink>
                )}
                {session.user.role === "user" && (
                  <NavLink href="/dashboard/user" icon={<LayoutDashboard className="w-4 h-4" />}>My Bookings</NavLink>
                )}
                <div className="ml-2 flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[100px]">{session.user.name}</span>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in bg-white dark:bg-gray-900">
            <div className="flex flex-col gap-1">
              <MobileNavLink href="/about" onClick={() => setOpen(false)}>About</MobileNavLink>
              <MobileNavLink href="/listing" onClick={() => setOpen(false)}>Vehicles</MobileNavLink>

              {!session ? (
                <>
                  <MobileNavLink href="/auth/login" onClick={() => setOpen(false)}>Login</MobileNavLink>
                  <MobileNavLink href="/auth/register" onClick={() => setOpen(false)}>Register</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink href="/add-vehicles" onClick={() => setOpen(false)}>Add Vehicle</MobileNavLink>
                  {session.user.role === "provider" && (
                    <MobileNavLink href="/dashboard/provider" onClick={() => setOpen(false)}>Provider Dashboard</MobileNavLink>
                  )}
                  {session.user.role === "user" && (
                    <MobileNavLink href="/dashboard/user" onClick={() => setOpen(false)}>My Bookings</MobileNavLink>
                  )}
                  <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Logged in as</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{session.user.role}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Desktop Nav Link Component
function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <button className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium">
        {icon}
        {children}
      </button>
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick}>
      <div className="px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
        {children}
      </div>
    </Link>
  );
}
