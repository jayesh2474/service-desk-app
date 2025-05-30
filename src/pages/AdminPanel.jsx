import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, User, Wrench, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const { tickets, updateTicketStatus } = useAppContext();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [solutionInput, setSolutionInput] = useState('');

  const openModal = (ticket: any) => {
    setSelectedTicket(ticket);
    setSolutionInput(ticket.solution || '');
    setShowModal(true);
  };

  const handleStatusChange = (id: string, status: 'In Progress' | 'Resolved', solution = '') => {
    updateTicketStatus(id, status, solution);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
        <p className="text-gray-400 mb-6">Manage, solve, and review support tickets.</p>

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
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3">{ticket.category}</td>
                    <td className="p-3">{ticket.priority}</td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'Resolved'
                            ? 'bg-green-600 text-white'
                            : ticket.status === 'In Progress'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      {ticket.createdBy}
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
              <p><span className="font-semibold">Priority:</span> {selectedTicket.priority}</p>
              <p><span className="font-semibold">Status:</span> {selectedTicket.status}</p>
              <p><span className="font-semibold">Description:</span> {selectedTicket.description}</p>

              {selectedTicket.status !== 'Resolved' && (
                <>
                  <label className="block mt-4 mb-1 font-semibold">Solution:</label>
                  <textarea
                    value={solutionInput}
                    onChange={(e) => setSolutionInput(e.target.value)}
                    className="w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded-lg"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    {selectedTicket.status === 'Open' && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                        onClick={() => handleStatusChange(selectedTicket.id, 'In Progress')}
                      >
                        Mark In Progress
                      </button>
                    )}
                    <button
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                      onClick={() => handleStatusChange(selectedTicket.id, 'Resolved', solutionInput)}
                    >
                      Mark Resolved
                    </button>
                  </div>
                </>
              )}

              {selectedTicket.status === 'Resolved' && (
                <>
                  <p className="mt-4"><span className="font-semibold">Solution:</span> {selectedTicket.solution}</p>
                </>
              )}

              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
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

export default AdminDashboard;
