import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  Menu,
  X,
  Home,
  LogIn,
  UserPlus,
  BarChart3,
  Plus,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const NavLink = ({ to, icon: Icon, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ServiceDesk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" icon={Home}>
              Home
            </NavLink>

            {user ? (
              <>
                {user.role !== "admin" && (
                  <>
                    <NavLink to="/dashboard" icon={BarChart3}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/raise-ticket" icon={Plus}>
                      Raise Ticket
                    </NavLink>
                  </>
                )}
                {user.role === "admin" && (
                  <NavLink to="/admin" icon={Settings}>
                    Admin Panel
                  </NavLink>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/20">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User size={16} />
                    <span className="text-sm">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={LogIn}>
                  Login
                </NavLink>
                <NavLink to="/register" icon={UserPlus}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10">
            <NavLink to="/" icon={Home} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>

            {user ? (
              <>
                {user.role !== "admin" && (
                  <>
                    <NavLink
                      to="/dashboard"
                      icon={BarChart3}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/raise-ticket"
                      icon={Plus}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Raise Ticket
                    </NavLink>
                  </>
                )}
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    icon={Settings}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                )}

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 px-4 py-2 text-gray-300">
                    <User size={16} />
                    <span className="text-sm">{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 w-full text-left rounded-lg text-red-300 hover:bg-red-500/20 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  icon={LogIn}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  icon={UserPlus}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
