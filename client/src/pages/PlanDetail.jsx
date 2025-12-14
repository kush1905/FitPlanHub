import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/plans/${id}`);
      setPlan(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plan');
      console.error('Error fetching plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      alert('Please login to subscribe to plans');
      navigate('/login');
      return;
    }

    if (user?.role !== 'user') {
      alert('Only users can subscribe to plans');
      return;
    }

    try {
      setSubscribing(true);
      await api.post(`/plans/${id}/subscribe`);
      alert('Successfully subscribed to plan!');
      fetchPlan(); // Refresh plan data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Plan not found'}</p>
          <Link
            to="/plans"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Back to Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/plans"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Plans
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.title}</h1>
              {plan.isSubscribed && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded">
                  Subscribed
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary-600">${plan.price}</p>
              {plan.duration && (
                <p className="text-sm text-gray-600">{plan.duration} days</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Trainer</h3>
            <Link
              to="/trainers"
              className="text-lg font-semibold text-primary-600 hover:text-primary-700"
            >
              {plan.trainer?.name || 'Unknown'}
            </Link>
          </div>

          {plan.description ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{plan.description}</p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                Subscribe to view full plan details and access all features.
              </p>
            </div>
          )}

          {plan.subscribersCount !== undefined && (
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{plan.subscribersCount}</span> subscribers
              </p>
            </div>
          )}

          {plan.createdAt && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {isAuthenticated && user?.role === 'user' && !plan.isSubscribed && (
            <Link
              to={`/payment/${plan._id}`}
              className="block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition text-lg font-semibold"
            >
              Subscribe to Plan
            </Link>
          )}

          {!isAuthenticated && (
            <div className="bg-gray-50 p-4 rounded text-center">
              <p className="text-gray-600 mb-2">Login to subscribe to this plan</p>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Login Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;

