import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Feed = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feed');
      setPlans(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load feed');
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setSubscribing(planId);
      await api.post(`/plans/${planId}/subscribe`);
      alert('Successfully subscribed to plan!');
      fetchFeed(); // Refresh feed
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Personalized Feed</h1>
          <p className="text-gray-600">
            Plans from trainers you follow, tailored to your interests
          </p>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
            {error.includes('follow') && (
              <Link
                to="/trainers"
                className="ml-2 text-yellow-800 underline font-semibold"
              >
                Browse Trainers
              </Link>
            )}
          </div>
        )}

        {plans.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg mb-4">
              No plans from followed trainers yet.
            </p>
            <Link
              to="/trainers"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
            >
              Follow Trainers
            </Link>
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

                <p className="text-gray-600 mb-4 line-clamp-3">{plan.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Trainer</p>
                    <Link
                      to="/trainers"
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

                <div className="mb-2">
                  <p className="text-xs text-gray-500">
                    {plan.subscribersCount || 0} subscribers
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/plans/${plan._id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition"
                  >
                    View Details
                  </Link>
                  {!plan.isSubscribed && (
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

export default Feed;

