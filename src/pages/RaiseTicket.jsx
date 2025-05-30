import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';


const RaiseTicket = () => {
  const { user, addTicket } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await addTicket(formData);
    navigate('/dashboard');
  } catch (err) {
    console.error("Failed to submit ticket", err);
    alert("Something went wrong while submitting the ticket.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
        <h1 className="text-3xl font-bold text-white mb-4">Raise a New Ticket</h1>
        <p className="text-gray-400 mb-6">Fill out the form below to create a support request.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
              placeholder="Enter ticket title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
              placeholder="Describe your issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                placeholder="e.g. Software, Hardware"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
              >
              <option value="High" style={{ color: 'black' }}>High</option>
    <option value="Medium" style={{ color: 'black' }}>Medium</option>
    <option value="Low" style={{ color: 'black' }}>Low</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
  {loading ? "Submitting..." : (
    <>
      <Plus className="h-5 w-5 mr-2" />
      Submit Ticket
    </>
  )}
</button>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
