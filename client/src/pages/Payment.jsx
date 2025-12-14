import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loader from '../components/Loader';

const Payment = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  useEffect(() => {
    fetchPlan();
  }, [planId]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/plans/${planId}`);
      setPlan(response.data.data);
    } catch (err) {
      alert('Failed to load plan details');
      navigate('/plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to subscribe');
      navigate('/login');
      return;
    }

    // Validate card data (basic validation)
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.cardholderName) {
        alert('Please fill in all card details');
        return;
      }
    }

    try {
      setProcessing(true);
      
      // In production, integrate with Stripe or payment gateway here
      // For now, simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Subscribe to plan
      await api.post(`/plans/${planId}/subscribe`);
      
      alert('Payment successful! You are now subscribed to this plan.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trainer: {plan.trainer?.name || 'Unknown'}
                </p>
                {plan.duration && (
                  <p className="text-sm text-gray-600">Duration: {plan.duration} days</p>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${plan.price}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">${plan.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <div className="mb-6">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handlePayment}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.cardholderName}
                      onChange={(e) =>
                        setCardData({ ...cardData, cardholderName: e.target.value })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) =>
                        setCardData({
                          ...cardData,
                          cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim(),
                        })
                      }
                      required
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            expiryDate: e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5),
                          })
                        }
                        required
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            cvv: e.target.value.replace(/\D/g, '').substring(0, 3),
                          })
                        }
                        required
                        maxLength={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ This is a demo payment. No actual charges will be made.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition disabled:opacity-50 font-semibold"
                  >
                    {processing ? 'Processing Payment...' : `Pay $${plan.price}`}
                  </button>
                </form>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">PayPal integration coming soon.</p>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    Use Card Instead
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

