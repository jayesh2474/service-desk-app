import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Ticket, Users, Clock, Shield, Zap, HeadphonesIcon } from 'lucide-react';
import { fadeInUp, fadeInDown, scaleIn, staggerContainer, slideInFromBottom, bounceIn } from '../utils/animations';

const Home = () => {
  const { user } = useAppContext();

  const features = [
    {
      icon: Ticket,
      title: 'Smart Ticketing',
      description: 'Create and manage support tickets with intelligent categorization and priority assignment.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless collaboration between departments with real-time updates and notifications.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Fast resolution times with automated routing and priority-based handling.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access and data protection.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime' },
    { number: '<2hrs', label: 'Avg Response' },
    { number: '50+', label: 'Companies' },
    { number: '24/7', label: 'Support' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto"
        >
          <div className="text-center">
            <motion.div 
              variants={bounceIn}
              className="flex justify-center mb-8"
            >
              <motion.div 
                animate={floatingAnimation}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl"
              >
                <HeadphonesIcon className="h-16 w-16 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              variants={fadeInDown}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Modern
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                {' '}Service Desk
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Streamline your support operations with our intelligent ticket management system. 
              Fast, secure, and designed for modern teams.
            </motion.p>

            <motion.div 
              variants={slideInFromBottom}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              x: [0, -50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          ></motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="text-center group"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to manage support
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for modern teams with powerful features that scale with your business
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-fit mb-6 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur border border-white/10 rounded-3xl p-12 shadow-2xl"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to transform your support?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-300 mb-8"
            >
              Join thousands of teams already using our platform to deliver exceptional support experiences.
            </motion.p>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;