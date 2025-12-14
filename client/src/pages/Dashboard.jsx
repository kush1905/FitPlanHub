import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [myPlans, setMyPlans] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'trainer') {
      fetchTrainerPlans();
    } else {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [plansRes, followingRes] = await Promise.all([
        api.get('/plans'),
        api.get('/users/following').catch(() => ({ data: { data: [] } })),
      ]);
      setPlans(plansRes.data.data || []);
      setFollowing(followingRes.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainerPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/plans/trainer/plans');
      setMyPlans(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            {user?.role === 'trainer'
              ? 'Manage your fitness plans and help users achieve their goals'
              : 'Explore fitness plans and track your progress'}
          </p>
        </div>

        {/* Stats Cards */}
        {user?.role === 'trainer' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{myPlans.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {myPlans.reduce((sum, plan) => sum + (plan.subscribers?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${myPlans.reduce((sum, plan) => {
                      return sum + (plan.price || 0) * (plan.subscribers?.length || 0);
                    }, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <span className="text-2xl">💪</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter((p) => !p.isSubscribed).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Subscribed Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter((p) => p.isSubscribed).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Following</p>
                  <p className="text-2xl font-bold text-gray-900">{following.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plans.filter((p) => p.isSubscribed).length > 0 ? 'Active' : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {user?.role === 'trainer' && (
          <div className="mb-8">
            <Link
              to="/trainer/panel"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition shadow-md"
            >
              Manage Plans →
            </Link>
          </div>
        )}

        {user?.role === 'user' && (
          <div className="mb-8 flex gap-4">
            <Link
              to="/feed"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition shadow-md"
            >
              View Feed →
            </Link>
            <Link
              to="/trainers"
              className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition shadow-md"
            >
              Browse Trainers →
            </Link>
          </div>
        )}

        {/* Plans Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {user?.role === 'trainer' ? 'Your Plans' : 'Available Plans'}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {user?.role === 'trainer' ? (
            myPlans.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600 mb-4">You haven't created any plans yet.</p>
                <Link
                  to="/trainer/panel"
                  className="inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  Create Your First Plan
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPlans.map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        {plan.subscribers?.length || 0} subscribers
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
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
                    <Link
                      to="/trainer/panel"
                      className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition"
                    >
                      Manage Plan
                    </Link>
                  </div>
                ))}
              </div>
            )
          ) : plans.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No plans available yet.</p>
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

                  {plan.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Trainer</p>
                      <p className="font-medium text-gray-900">
                        {plan.trainer?.name || 'Unknown'}
                      </p>
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
                    {user?.role === 'user' && !plan.isSubscribed && (
                      <button
                        onClick={async () => {
                          try {
                            await api.post(`/plans/${plan._id}/subscribe`);
                            alert('Successfully subscribed to plan!');
                            fetchPlans();
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to subscribe');
                          }
                        }}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition"
                      >
                        Subscribe
                      </button>
                    )}
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

