import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, User, Wrench } from 'lucide-react';

const AdminDashboard = () => {
  const { tickets, updateTicketStatus } = useAppContext();

  const handleStatusChange = (id: string, status: 'In Progress' | 'Resolved') => {
    updateTicketStatus(id, status);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Admin Panel</h1>
        <p className="text-gray-400 mb-6">Manage all raised tickets, assign, and resolve issues.</p>

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
                    No tickets raised.
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
                      {ticket.status !== 'Resolved' && (
                        <>
                          {ticket.status === 'Open' && (
                            <button
                              onClick={() => handleStatusChange(ticket.id, 'In Progress')}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm"
                            >
                              <Wrench className="inline h-4 w-4 mr-1" />
                              In Progress
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusChange(ticket.id, 'Resolved')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                          >
                            <CheckCircle className="inline h-4 w-4 mr-1" />
                            Resolve
                          </button>
                        </>
                      )}
                      {ticket.status === 'Resolved' && (
                        <button
                          disabled
                          className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm cursor-not-allowed"
                        >
                          <XCircle className="inline h-4 w-4 mr-1" />
                          Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
