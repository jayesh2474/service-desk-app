import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, Loader, AlertCircle, CheckCircle, Clock, Calendar, User } from 'lucide-react';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { user } = useAppContext();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRef = doc(db, "tickets", ticketId);
        const ticketSnap = await getDoc(ticketRef);
        
        if (ticketSnap.exists()) {
          setTicket({ id: ticketSnap.id, ...ticketSnap.data() });
        } else {
          setError("Ticket not found");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError(`Failed to load ticket: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);
  
  // Format date string
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
      return 'Invalid date';
    }
  };
  
  // Mask email to show only first 3 characters and domain
  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 3) {
      return `${username}***@${domain}`;
    }
    return `${username.substring(0, 3)}***@${domain}`;
  };

  // Get status color
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-400" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (!ticket) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ticket Not Found</h2>
          <p className="text-gray-400 mb-6">The ticket you are looking for does not exist or you don't have permission to view it.</p>
          <Link 
            to="/dashboard" 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        {/* Ticket Header */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-white">{ticket.title}</h1>
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
              {getStatusIcon(ticket.status)}
              {ticket.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Created: {formatDate(ticket.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" />
              <span>Category: {ticket.category || 'General'}</span>
            </div>
            
            {ticket.priority && (
              <div className="flex items-center gap-2 text-gray-400">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.priority === 'High' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : ticket.priority === 'Medium'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {ticket.priority} Priority
                </span>
              </div>
            )}
            
            {ticket.lastUpdated && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {formatDate(ticket.lastUpdated)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Ticket Description */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-300 whitespace-pre-line">{ticket.description}</p>
        </div>
        
        {/* Assigned Support Rep */}
        {ticket.assignedTo && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Support Representative</h2>
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white">{maskEmail(ticket.assignedTo)}</p>
                <p className="text-sm text-gray-400">Managing your request</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Solution if ticket is resolved */}
        {ticket.status === 'Resolved' && ticket.solution && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Solution</h2>
            <p className="text-gray-300 whitespace-pre-line">{ticket.solution}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;