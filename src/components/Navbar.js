import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          layoutId="navHover"
        />
        <Icon size={18} className="relative z-10" />
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg"
              >
                <Settings className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white">ServiceDesk</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:flex items-center space-x-4"
          >
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
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/20"
                >
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User size={16} />
                    <span className="text-sm">{user.name || user.email}</span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </motion.button>
                </motion.div>
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
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 space-y-2 border-t border-white/10 overflow-hidden"
            >
              <motion.div
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
              >
                <motion.div
                  variants={{
                    open: { y: 0, opacity: 1 },
                    closed: { y: -20, opacity: 0 },
                  }}
                >
                  <NavLink
                    to="/"
                    icon={Home}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                </motion.div>

                {user ? (
                  <>
                    {user.role !== "admin" && (
                      <>
                        <motion.div
                          variants={{
                            open: { y: 0, opacity: 1 },
                            closed: { y: -20, opacity: 0 },
                          }}
                        >
                          <NavLink
                            to="/dashboard"
                            icon={BarChart3}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Dashboard
                          </NavLink>
                        </motion.div>
                        <motion.div
                          variants={{
                            open: { y: 0, opacity: 1 },
                            closed: { y: -20, opacity: 0 },
                          }}
                        >
                          <NavLink
                            to="/raise-ticket"
                            icon={Plus}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Raise Ticket
                          </NavLink>
                        </motion.div>
                      </>
                    )}
                    {user.role === "admin" && (
                      <motion.div
                        variants={{
                          open: { y: 0, opacity: 1 },
                          closed: { y: -20, opacity: 0 },
                        }}
                      >
                        <NavLink
                          to="/admin"
                          icon={Settings}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </NavLink>
                      </motion.div>
                    )}

                    <motion.div
                      variants={{
                        open: { y: 0, opacity: 1 },
                        closed: { y: -20, opacity: 0 },
                      }}
                      className="pt-4 border-t border-white/10"
                    >
                      <div className="flex items-center space-x-2 px-4 py-2 text-gray-300">
                        <User size={16} />
                        <span className="text-sm">
                          {user.name || user.email}
                        </span>
                      </div>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 px-4 py-2 w-full text-left rounded-lg text-red-300 hover:bg-red-500/20 transition-all duration-300"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      variants={{
                        open: { y: 0, opacity: 1 },
                        closed: { y: -20, opacity: 0 },
                      }}
                    >
                      <NavLink
                        to="/login"
                        icon={LogIn}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </NavLink>
                    </motion.div>
                    <motion.div
                      variants={{
                        open: { y: 0, opacity: 1 },
                        closed: { y: -20, opacity: 0 },
                      }}
                    >
                      <NavLink
                        to="/register"
                        icon={UserPlus}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </NavLink>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
