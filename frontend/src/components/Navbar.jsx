import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

       
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-2xl text-slate-900">
            AVPL TaskManager
          </Link>

          {user && (
            <span className="hidden sm:block text-sm font-medium text-slate-600 bg-gray-100 px-3 py-1 rounded-full">
              Hi, {user.username}
            </span>
          )}
        </div>

       
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Link
                  to="/"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  All Tasks
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <svg width="28" height="28" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="22" y2="22" />
              <line x1="22" y1="6" x2="6" y2="22" />
            </svg>
          ) : (
            <svg width="28" height="28" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="8" x2="24" y2="8" />
              <line x1="4" y1="14" x2="24" y2="14" />
              <line x1="4" y1="20" x2="24" y2="20" />
            </svg>
          )}
        </button>
      </div>

      
      {open && (
        <div className="md:hidden bg-white shadow-md border-t p-4 flex flex-col gap-3">

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  All Tasks
                </Link>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

          
          {user && (
            <div className="mt-2 text-center text-slate-600 font-medium">
              Hi, {user.username}
            </div>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
