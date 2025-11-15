'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Plus, Minus, Trash2, CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';
//import { auth, restaurants, orders, payments } from '@/lib/api';
import { auth, restaurants, orders, payments } from '../lib/api';


export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [cart, setCart] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      loadData();
    }
    setLoading(false);
  }, []);

  const loadData = async () => {
    try {
      // Load restaurants
      const restaurantsRes = await restaurants.getAll();
      setRestaurantsList(restaurantsRes.data.data);

      // Load menu items for each restaurant
      for (const restaurant of restaurantsRes.data.data) {
        const menuRes = await restaurants.getMenu(restaurant.id);
        setMenuItems(prev => ({
          ...prev,
          [restaurant.id]: menuRes.data.data
        }));
      }

      // Load payment methods (if admin)
      try {
        const paymentsRes = await payments.getAll();
        setPaymentMethods(paymentsRes.data.data);
        if (paymentsRes.data.data.length > 0) {
          setSelectedPayment(paymentsRes.data.data[0]);
        }
      } catch (err) {
        // User doesn't have permission
        setPaymentMethods([
          { id: 1, type: 'Credit Card', last4: '4242', brand: 'Visa' },
          { id: 2, type: 'Debit Card', last4: '5555', brand: 'Mastercard' }
        ]);
        setSelectedPayment({ id: 1, type: 'Credit Card', last4: '4242', brand: 'Visa' });
      }

      // Load orders
      const ordersRes = await orders.getAll();
      setOrdersList(ordersRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading data', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await auth.login({ username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setCurrentUser(user);
      setUsername('');
      setPassword('');
      
      showNotification(`Welcome, ${user.name}!`);
      loadData();
    } catch (error) {
      showNotification(error.response?.data?.error || 'Login failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setCart([]);
    setOrdersList([]);
    setRestaurantsList([]);
    setMenuItems({});
    showNotification('Logged out successfully');
  };

  const hasPermission = (action) => {
    if (!currentUser) return false;
    
    const permissions = {
      'place_order': ['ADMIN', 'MANAGER'],
      'cancel_order': ['ADMIN', 'MANAGER'],
      'update_payment': ['ADMIN']
    };
    
    return permissions[action]?.includes(currentUser.role) || false;
  };

  const addToCart = (restaurant, item) => {
    const existingItem = cart.find(
      cartItem => cartItem.itemId === item.id && cartItem.restaurantId === restaurant.id
    );

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.itemId === item.id && cartItem.restaurantId === restaurant.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        quantity: 1,
        currency: item.currency,
        country: restaurant.country
      }]);
    }
    showNotification(`${item.name} added to cart`);
  };

  const updateQuantity = (itemId, restaurantId, delta) => {
    setCart(cart.map(item => {
      if (item.itemId === itemId && item.restaurantId === restaurantId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId, restaurantId) => {
    setCart(cart.filter(item => !(item.itemId === itemId && item.restaurantId === restaurantId)));
    showNotification('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    try {
      await orders.create({
        items: cart,
        paymentMethod: selectedPayment
      });

      showNotification('Order placed successfully!');
      setCart([]);
      setShowCart(false);
      
      // Reload orders
      const ordersRes = await orders.getAll();
      setOrdersList(ordersRes.data.data);
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to place order', 'error');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await orders.cancel(orderId);
      showNotification('Order cancelled successfully');
      
      // Reload orders
      const ordersRes = await orders.getAll();
      setOrdersList(ordersRes.data.data);
    } catch (error) {
      showNotification(error.response?.data?.error || 'Failed to cancel order', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Food Ordering System</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Login
            </button>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Admin: nick.fury / admin123</p>
            <p>Manager (India): captain.marvel / manager123</p>
            <p>Manager (America): captain.america / manager123</p>
            <p>Member (India): thanos / member123</p>
          </div>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Food Ordering</h1>
            <p className="text-sm text-gray-600">
              {currentUser.name} ({currentUser.role})
              {currentUser.country && ` - ${currentUser.country}`}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => { setShowOrders(!showOrders); setShowCart(false); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              My Orders
            </button>
            <button
              onClick={() => { setShowCart(!showCart); setShowOrders(false); }}
              className="relative px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Cart ({cart.length})
            </button>
            {hasPermission('update_payment') && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <CreditCard size={20} />
                Payment
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!showOrders && !showCart ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Restaurants {currentUser.country && `in ${currentUser.country}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurantsList.map(restaurant => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">{restaurant.cuisine} • {restaurant.country}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {menuItems[restaurant.id]?.map(item => (
                      <div key={item.id} className="border-t pt-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              {item.currency === 'INR' ? `₹${item.price}` : `$${item.price}`}
                            </p>
                          </div>
                          <button
                            onClick={() => addToCart(restaurant, item)}
                            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : showOrders ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Orders</h2>
              <button
                onClick={() => setShowOrders(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back to Restaurants
              </button>
            </div>
            {ordersList.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {order.status}
                        </span>
                      </div>
                      {hasPermission('cancel_order') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 border-t pt-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.item_name} x {item.quantity} ({item.restaurant_name})</span>
                          <span className="font-semibold">
                            {order.currency === 'INR' ? `₹${item.price * item.quantity}` : `$${item.price * item.quantity}`}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-green-600">
                          {order.currency === 'INR' ? `₹${order.total}` : `$${order.total}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Continue Shopping
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-4 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.itemName}</h4>
                        <p className="text-sm text-gray-600">{item.restaurantName}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {item.currency === 'INR' ? `₹${item.price}` : `$${item.price}`} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.restaurantId, -1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.restaurantId, 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.itemId, item.restaurantId)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total</span>
                    <span className="text-green-600">
                      {cart[0]?.currency === 'INR' ? `₹${calculateTotal()}` : `$${calculateTotal()}`}
                    </span>
                  </div>
                  {selectedPayment && (
                    <p className="text-sm text-gray-600 mb-4">
                      Payment: {selectedPayment.type} {selectedPayment.last4 ? `****${selectedPayment.last4}` : selectedPayment.identifier}
                    </p>
                  )}
                  {hasPermission('place_order') ? (
                    <button
                      onClick={placeOrder}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
                    >
                      Place Order
                    </button>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
                      You don't have permission to place orders. Please contact your manager.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Payment Methods</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                    showNotification('Payment method updated');
                  }}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedPayment?.id === method.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} />
                    <div>
                      <p className="font-semibold">{method.type}</p>
                      <p className="text-sm text-gray-600">
                        {method.last4 ? `${method.brand} ****${method.last4}` : method.identifier}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}