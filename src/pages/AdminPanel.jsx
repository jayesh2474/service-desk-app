import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, User, Wrench, Eye, Loader, AlertCircle, Clock } from 'lucide-react';
import { collection, query, orderBy, getDocs, doc, updateDoc, limit, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, updateTicket } = useAppContext();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [solutionInput, setSolutionInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if current user is an admin
  const isAdmin = user?.role === 'admin';

  // Fetch all tickets from Firestore
  useEffect(() => {
    const fetchAllTickets = async () => {
      if (!isAdmin) return;

      try {
        setIsLoading(true);
        
        // Create a query to get all tickets
        const ticketsRef = collection(db, "tickets");
        let ticketsQuery = query(
          ticketsRef,
          orderBy("createdAt", "desc"),
          limit(100) // Limit to prevent loading too many
        );

        const querySnapshot = await getDocs(ticketsQuery);
        
        if (querySnapshot.empty) {
          console.log("No tickets found");
          setTickets([]);
        } else {
          const ticketData = [];
          querySnapshot.forEach((doc) => {
            ticketData.push({ id: doc.id, ...doc.data() });
          });
          setTickets(ticketData);
          console.log("Loaded", ticketData.length, "tickets");
        }
        
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(`Failed to load tickets: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchAllTickets();
  }, [isAdmin]);

  // Open modal with ticket details
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setSolutionInput(ticket.solution || '');
    setShowModal(true);
  };

  // Update ticket status and solution
  const handleStatusChange = async (id, status, solution = '') => {
    try {
      // Update in Firestore directly
      const ticketRef = doc(db, "tickets", id);
      const updateData = {
        status,
        ...(status === 'Resolved' && { solution }),
        ...(status === 'In Progress' && { assignedTo: user.email }),
        lastUpdated: new Date().toISOString(),
      };
      
      await updateDoc(ticketRef, updateData);
      
      // Update local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === id ? { ...ticket, ...updateData } : ticket
        )
      );
      
      setShowModal(false);
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert(`Failed to update ticket: ${err.message}`);
    }
  };

  // Filter tickets by status
  const getFilteredTickets = () => {
    if (statusFilter === 'all') {
      return tickets;
    }
    return tickets.filter(ticket => ticket.status === statusFilter);
  };

  const filteredTickets = getFilteredTickets();

  // If user is not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white/5 backdrop-blur border border-white/10 rounded-xl max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Tickets</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
        <p className="text-gray-400 mb-6">Manage, solve, and review support tickets.</p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Tickets</p>
                <p className="text-xl font-bold text-white">{tickets.length}</p>
              </div>
              <div className="bg-gray-500/20 p-2 rounded-lg">
                <Wrench className="h-5 w-5 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Open</p>
                <p className="text-xl font-bold text-yellow-400">
                  {tickets.filter(t => t.status === 'Open').length}
                </p>
              </div>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">In Progress</p>
                <p className="text-xl font-bold text-blue-400">
                  {tickets.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Resolved</p>
                <p className="text-xl font-bold text-green-400">
                  {tickets.filter(t => t.status === 'Resolved').length}
                </p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              statusFilter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('Open')}
            className={`px-3 py-1 rounded-md text-sm ${
              statusFilter === 'Open' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setStatusFilter('In Progress')}
            className={`px-3 py-1 rounded-md text-sm ${
              statusFilter === 'In Progress' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setStatusFilter('Resolved')}
            className={`px-3 py-1 rounded-md text-sm ${
              statusFilter === 'Resolved' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Resolved
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/5 border border-white/10 rounded-xl text-white shadow-md">
            <thead className="bg-white/10 border-b border-white/20">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3">{ticket.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${ticket.priority === 'High' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : ticket.priority === 'Medium'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                        }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'Resolved'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : ticket.status === 'In Progress'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {ticket.status === 'Resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {ticket.status === 'In Progress' && <Clock className="h-3 w-3 mr-1" />}
                        {ticket.status === 'Open' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      {ticket.createdByName || ticket.createdBy.split('@')[0]}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => openModal(ticket)}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
                      >
                        <Eye className="inline h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Full Report Modal */}
        {showModal && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 rounded-xl shadow-xl w-[90%] max-w-2xl p-6 text-white relative">
              <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
              <p><span className="font-semibold">Title:</span> {selectedTicket.title}</p>
              <p><span className="font-semibold">Category:</span> {selectedTicket.category}</p>
              <p className="mt-2">
                <span className="font-semibold">Priority:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium 
                  ${selectedTicket.priority === 'High' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : selectedTicket.priority === 'Medium'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                  {selectedTicket.priority}
                </span>
              </p>
              <p className="mt-2">
                <span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold 
                  ${selectedTicket.status === 'Resolved'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : selectedTicket.status === 'In Progress'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                  {selectedTicket.status}
                </span>
              </p>
              <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                <p className="font-semibold mb-1">Description:</p>
                <p className="text-gray-300">{selectedTicket.description}</p>
              </div>

              <div className="mt-4 bg-gray-800/50 p-3 rounded-lg">
                <p className="font-semibold">Submitted by:</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <p>{selectedTicket.createdByName || selectedTicket.createdBy}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Created on: {new Date(selectedTicket.createdAt).toLocaleDateString()} at {new Date(selectedTicket.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {selectedTicket.status !== 'Resolved' && (
                <>
                  <div className="mt-4">
                    <label className="block mb-1 font-semibold">Solution / Notes:</label>
                    <textarea
                      value={solutionInput}
                      onChange={(e) => setSolutionInput(e.target.value)}
                      className="w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter solution details or internal notes..."
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    {selectedTicket.status === 'Open' && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
                        onClick={() => handleStatusChange(selectedTicket.id, 'In Progress')}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Progress
                      </button>
                    )}
                    <button
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center"
                      onClick={() => handleStatusChange(selectedTicket.id, 'Resolved', solutionInput)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </button>
                  </div>
                </>
              )}

              {selectedTicket.status === 'Resolved' && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="font-semibold text-green-300 mb-1">Solution:</p>
                  <p className="text-gray-300">{selectedTicket.solution || "No solution details provided."}</p>
                </div>
              )}

              {selectedTicket.assignedTo && (
                <div className="mt-3">
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold">Assigned to:</span> {selectedTicket.assignedTo}
                  </p>
                </div>
              )}

              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
