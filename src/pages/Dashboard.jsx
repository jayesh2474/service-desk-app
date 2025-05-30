import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, Ticket, Clock, CheckCircle, AlertCircle, XCircle, Eye, Calendar, User, Loader } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard = () => {
  const { user } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userTickets, setUserTickets] = useState([]);

  // Directly fetch tickets when component mounts or user changes
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Attempting to fetch tickets for:", user.email);
        
        // Create a query to get tickets for the current user's email
        const ticketsRef = collection(db, "tickets");
        const q = query(
          ticketsRef,
          where("createdBy", "==", user.email),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        console.log("Query returned doc count:", querySnapshot.size);
        
        if (querySnapshot.empty) {
          console.log("No tickets found for user", user.email);
          setUserTickets([]);
        } else {
          const ticketData = [];
          querySnapshot.forEach((doc) => {
            console.log("Found ticket:", doc.id, doc.data().title);
            ticketData.push({ id: doc.id, ...doc.data() });
          });
          setUserTickets(ticketData);
          console.log("Set userTickets with", ticketData.length, "tickets");
        }
        
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(`Failed to load tickets: ${err.message}`);
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchTickets();
  }, [user]);

  // Get ticket statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'Open').length,
    inProgress: userTickets.filter(t => t.status === 'In Progress').length,
    resolved: userTickets.filter(t => t.status === 'Resolved').length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Low':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Date formatting error:", e);
      return 'Invalid date';
    }
  };

  // Extract user's display name from various possible sources
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      // Extract name from email (before @ symbol)
      const nameFromEmail = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return nameFromEmail
        .split(/[._]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'User';
  };

  if (!user) {
    // Handle case where user isn't logged in yet
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white/5 backdrop-blur border border-white/10 rounded-xl max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Please log in</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view this page.</p>
          <Link 
            to="/login" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  // Handle error state with option to try again
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white/5 backdrop-blur border border-white/10 rounded-xl max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Tickets</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setIsLoading(true);
                setError(null);
              }} 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/raise-ticket" 
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Create New Ticket
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {getUserName()}!
          </h1>
          <p className="text-gray-400">Manage your support tickets and track their progress</p>
          <div className="mt-2 text-sm text-gray-400">
            <p>Signed in as: {user.email}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Link
            to="/raise-ticket"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Raise New Ticket
          </Link>
        </div>

        {/* Debug Info - remove in production */}
        <div className="mb-4 p-4 bg-black/30 rounded-lg text-xs text-gray-400">
          <p>Debug: Found {userTickets.length} tickets for {user.email}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-gray-500/20 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Open</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.open}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">{stats.inProgress}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Tickets</h2>
            <Link
              to="/raise-ticket"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create new ticket
            </Link>
          </div>

          {userTickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No tickets yet</h3>
              <p className="text-gray-400 mb-6">
                Start by creating your first support ticket
              </p>
              <Link
                to="/raise-ticket"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-2" />
                Raise New Ticket
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(ticket.createdAt)}
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Category:</span>
                          <span className="text-xs font-medium text-white">{ticket.category || 'General'}</span>
                        </div>
                        
                        {ticket.assignedTo && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="text-xs">Assigned to: {ticket.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link 
                        to={`/tickets/${ticket.id}`}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">View</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;