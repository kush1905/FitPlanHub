import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const TrainerPanel = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/plans/trainer/plans');
      setPlans(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.price || !formData.duration) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/plans', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      });
      setShowCreateForm(false);
      setFormData({ title: '', description: '', price: '', duration: '' });
      fetchPlans();
      alert('Plan created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      await api.put(`/plans/${editingPlan._id}`, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      });
      setEditingPlan(null);
      setFormData({ title: '', description: '', price: '', duration: '' });
      fetchPlans();
      alert('Plan updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await api.delete(`/plans/${planId}`);
      fetchPlans();
      alert('Plan deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete plan');
    }
  };

  const startEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
    });
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingPlan(null);
    setFormData({ title: '', description: '', price: '', duration: '' });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trainer Panel</h1>
            <p className="text-gray-600">Manage your fitness plans</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              if (showCreateForm) cancelForm();
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
          >
            {showCreateForm ? 'Cancel' : '+ Create Plan'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={editingPlan ? handleEditPlan : handleCreatePlan}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 30-Day Weight Loss Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="29.99"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="30"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your fitness plan in detail..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Plans</h2>
          {plans.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <p className="text-gray-600 text-lg mb-4">You haven't created any plans yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      {plan.subscribers?.length || 0} subscribers
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-xl font-bold text-primary-600">${plan.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-semibold">{plan.duration} days</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(plan)}
                      className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
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

export default TrainerPanel;

