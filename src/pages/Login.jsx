import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { fadeInUp, fadeInDown, scaleIn, staggerContainer } from '../utils/animations';

const Login = () => {
  const { login, user } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Demo credentials for testing
      if (formData.email === 'admin@demo.com' && formData.password === 'admin123') {
        login(formData.email, formData.password, 'admin');
        navigate('/admin');
      } else if (formData.email && formData.password) {
        login(formData.email, formData.password, 'user');
        navigate('/dashboard');
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div variants={fadeInDown} className="text-center">
          <motion.div 
            variants={scaleIn}
            className="flex justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <LogIn className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl font-bold text-white mb-2"
          >
            Welcome back
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-gray-400"
          >
            Sign in to your account to continue
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fadeInUp}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={fadeInUp}
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>

            {/* Register Link */}
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;