'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; 

const MainNavbar = () => { 
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [role,setRole]=useState("")

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/currentUser", { 
        cache: 'no-cache' 
      });
      
      if (!response.ok) throw new Error("Failed to fetch user data");
      
      const { data } = await response.json();
      setUserData(data || {});
      setRole(data.roles[0])
    } catch (error) {
      console.error("Fetch error:", error);
      setUserData({});
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = async () => {
    try {
      const response = await fetch("/api/user/logOut", { 
        method: "GET",
        cache: 'no-cache'
      });
      
      const json = await response.json();

      if (json.status === "success") {
        toast.success("Log Out Success");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  // Navigation items configuration
  const navItems = [
    { href: '/', label: 'Home' }, 
    { href: '/dashboard/pages/article', label: 'Post To Rent' },
    { href: '/dashboard/pages/about', label: 'Why Here' },
    { href: '/dashboard/pages/support', label: 'Support' }
  ];

  // Admin-only items
  const adminItems = [
    { href: '/dashboard/pages/admin', label: 'Admin Panel' },
    { href: '/dashboard/pages/admin/statistics', label: 'Statistics' },
  ];

  const renderNavItem = (item) => (
    <li key={item.href}>
      <Link href={item.href} className="w-full text-emerald-100/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300">
        {item.label}
      </Link>
    </li>
  );
 
  return (
    <div className="navbar bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-lg border-b border-white/10 shadow-2xl fixed top-0 z-50">
      {/* Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white hover:bg-white/10 border border-white/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h8m-8 6h16" 
              />
            </svg>
          </div>
          
          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-2xl z-50 mt-3 w-56 p-2 shadow-2xl"
          >
            {/* Regular navigation items */}
            {navItems.map(renderNavItem)}
            
            {/* Admin items (if user is admin) */}
            {role==="ADMIN" && adminItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="w-full text-purple-300 hover:text-white hover:bg-purple-500/20 px-4 py-2 rounded-lg transition-all duration-300 font-semibold">
                  👑 {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <div className="w-12 h-12 hidden md:flex items-center justify-center">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform duration-300">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
              🏠
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="text-emerald-100/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Admin items with visual distinction */}
          {role === 'ADMIN' && 
            adminItems.map(item => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="text-purple-300 hover:text-white hover:bg-purple-500/20 px-6 py-3 rounded-xl transition-all duration-300 border border-purple-400/30 font-semibold"
                >
                  👑 {item.label}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>

      {/* User Section */}
      <div className="navbar-end">
        {!isLoading && (
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search" 
              className="input input-bordered w-24 md:w-auto bg-white/10 border-emerald-400/30 text-white placeholder-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" 
            />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-white/20 hover:border-emerald-400/30 hover:bg-white/10 transition-all duration-300">
                <div className="w-10 rounded-full ring-2 ring-emerald-400/30">
                  <img
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-2xl z-1 mt-3 w-52 p-2 shadow-2xl">
                <li>
                  <Link href={"/dashboard/pages/myDashboard/house"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                    My Houses
                  </Link>
                </li>
                <li>
                  <Link href={"/dashboard/pages/myDashboard/book"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                    My Booking
                  </Link>
                </li> 
                <li>
                  <a className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">Settings</a>
                </li>
                <li>
                  <button
                      onClick={logOut}
                      className="btn btn-ghost hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/30 text-emerald-100/80 transition-all duration-300 w-full justify-start"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Logout'  // Ensure this text does not contain unescaped characters
                      )}
                    </button>

                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;