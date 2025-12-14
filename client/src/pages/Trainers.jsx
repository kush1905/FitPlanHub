import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Trainers = () => {
  const { user, isAuthenticated } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/trainers');
      setTrainers(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load trainers');
      console.error('Error fetching trainers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (trainerId) => {
    if (!isAuthenticated) {
      alert('Please login to follow trainers');
      return;
    }

    if (user?.role !== 'user') {
      alert('Only users can follow trainers');
      return;
    }

    try {
      setFollowing(trainerId);
      await api.post(`/users/trainers/${trainerId}/follow`);
      alert('Successfully followed trainer!');
      fetchTrainers(); // Refresh trainers
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow trainer');
    } finally {
      setFollowing(null);
    }
  };

  const handleUnfollow = async (trainerId) => {
    try {
      setFollowing(trainerId);
      await api.post(`/users/trainers/${trainerId}/unfollow`);
      alert('Successfully unfollowed trainer');
      fetchTrainers(); // Refresh trainers
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unfollow trainer');
    } finally {
      setFollowing(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expert Trainers</h1>
          <p className="text-gray-600">
            Connect with certified fitness trainers and get personalized guidance
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {trainers.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">No trainers available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <div
                key={trainer._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
                    {trainer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{trainer.name}</h3>
                    <p className="text-sm text-gray-600">{trainer.email}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                    Certified Trainer
                  </span>
                </div>

                {isAuthenticated && user?.role === 'user' && (
                  <button
                    onClick={() =>
                      trainer.isFollowing
                        ? handleUnfollow(trainer._id)
                        : handleFollow(trainer._id)
                    }
                    disabled={following === trainer._id}
                    className={`w-full py-2 px-4 rounded-md transition ${
                      trainer.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } disabled:opacity-50`}
                  >
                    {following === trainer._id
                      ? 'Processing...'
                      : trainer.isFollowing
                      ? 'Unfollow'
                      : 'Follow'}
                  </button>
                )}

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Login to follow trainers
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainers;

