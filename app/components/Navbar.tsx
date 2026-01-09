"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Menu, X, Car, User, LogIn, UserPlus, LayoutDashboard, Plus } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
              Rent A Ride
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/about" icon={null}>About</NavLink>
            <NavLink href="/listing" icon={<Car className="w-4 h-4" />}>Vehicles</NavLink>

            {!session ? (
              <>
                <NavLink href="/auth/login" icon={<LogIn className="w-4 h-4" />}>Login</NavLink>
                <Link href="/auth/register">
                  <button className="ml-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                <NavLink href="/add-vehicles" icon={<Plus className="w-4 h-4" />}>Add Vehicle</NavLink>
                {session.user.role === "provider" && (
                  <NavLink href="/dashboard/provider" icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</NavLink>
                )}
                {session.user.role === "user" && (
                  <NavLink href="/dashboard/user" icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</NavLink>
                )}
                <div className="ml-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-600">
                  <User className="w-4 h-4 text-gray-300" />
                  <span className="text-sm font-medium text-gray-200">{session.user.name}</span>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-gray-700 animate-fade-in bg-gray-900">
            <div className="flex flex-col gap-2">
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
                    <MobileNavLink href="/dashboard/user" onClick={() => setOpen(false)}>User Dashboard</MobileNavLink>
                  )}
                  <div className="mt-2 p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <p className="font-medium text-gray-200">{session.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
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
      <button className="px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 text-gray-300 hover:text-gray-100 font-medium">
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
      <div className="px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition-all duration-200 text-gray-300 hover:text-gray-100 font-medium border border-transparent hover:border-gray-600">
        {children}
      </div>
    </Link>
  );
}
