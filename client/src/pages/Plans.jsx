import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Plans = () => {
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/plans');
      setPlans(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      alert('Please login to subscribe to plans');
      return;
    }

    if (user?.role !== 'user') {
      alert('Only users can subscribe to plans');
      return;
    }

    try {
      setSubscribing(planId);
      await api.post(`/plans/${planId}/subscribe`);
      alert('Successfully subscribed to plan!');
      fetchPlans(); // Refresh plans
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Fitness Plans</h1>
          <p className="text-gray-600">Browse and subscribe to personalized workout plans</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No plans available yet.</p>
            {user?.role === 'trainer' && (
              <Link
                to="/dashboard"
                className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
              >
                Create Your First Plan
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                  {plan.isSubscribed && (
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                      Subscribed
                    </span>
                  )}
                </div>

                {plan.description ? (
                  <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>
                ) : (
                  <p className="text-gray-500 mb-4 italic text-sm">
                    Subscribe to view full plan details
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Trainer</p>
                    <Link
                      to={`/trainers`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {plan.trainer?.name || 'Unknown'}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">${plan.price}</p>
                    {plan.duration && (
                      <p className="text-sm text-gray-600">{plan.duration} days</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/plans/${plan._id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
                  >
                    View Details
                  </Link>
                  {isAuthenticated && user?.role === 'user' && !plan.isSubscribed && (
                    <Link
                      to={`/payment/${plan._id}`}
                      className="flex-1 text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition"
                    >
                      Subscribe
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;

