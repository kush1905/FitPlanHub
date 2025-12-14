import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Fitness Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with expert trainers, subscribe to personalized workout plans,
            and achieve your fitness goals with FitPlanHub.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-primary-600"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/trainers"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-primary-600 text-4xl mb-4 group-hover:scale-110 transition">
              💪
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">
              Expert Trainers
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with certified fitness trainers and get personalized guidance.
            </p>
            <span className="text-primary-600 font-semibold group-hover:underline">
              Browse Trainers →
            </span>
          </Link>

          <Link
            to="/plans"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-primary-600 text-4xl mb-4 group-hover:scale-110 transition">
              📋
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">
              Custom Plans
            </h3>
            <p className="text-gray-600 mb-4">
              Subscribe to workout and diet plans tailored to your fitness goals.
            </p>
            <span className="text-primary-600 font-semibold group-hover:underline">
              View Plans →
            </span>
          </Link>

          <Link
            to={isAuthenticated ? '/feed' : '/login'}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer group"
          >
            <div className="text-primary-600 text-4xl mb-4 group-hover:scale-110 transition">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">
              Track Progress
            </h3>
            <p className="text-gray-600 mb-4">
              Monitor your fitness journey and celebrate your achievements.
            </p>
            <span className="text-primary-600 font-semibold group-hover:underline">
              {isAuthenticated ? 'View Feed →' : 'Get Started →'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

