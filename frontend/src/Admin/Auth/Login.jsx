import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiShield,
  FiArrowLeft,
  FiKey,
  FiAlertCircle
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginAdminMutation } from '../../api/adminApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const [loginAdmin]=useLoginAdminMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  setLoginError("");

  try {
    const res = await loginAdmin({
      email: formData.email,
      password: formData.password,
    }).unwrap();

    alert("Login successfull!");

   
   

    navigate("/admin/dashboard");

  } catch (error) {
   
    setLoginError(error?.data?.message || "Login failed");
  } finally {
    setIsSubmitting(false);
  }
};

  // Check for remembered email on component mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
         style={{ backgroundColor: 'var(--color-dark-100)' }}>
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 animate-gradient" 
          style={{ 
            background: 'linear-gradient(90deg, var(--color-accent-primary) 0%, transparent 50%, var(--color-accent-secondary) 100%)',
            opacity: 0.1
          }}
        />
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: 'var(--color-accent-primary)',
              opacity: 0.1,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Back to home link */}
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center space-x-2 text-gray-400 hover:text-[var(--color-accent-primary)] transition-colors z-10"
      >
        <FiArrowLeft />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full"
      >
        <div 
          className="rounded-2xl shadow-2xl p-8"
          style={{ backgroundColor: 'var(--color-dark-200)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-dark-300)' }}
              >
                <FiShield className="text-4xl" style={{ color: 'var(--color-accent-primary)' }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                Admin Login
              </span>
            </h2>
            <p className="text-gray-400">Welcome back! Please enter your details</p>
          </div>

          {/* Login Error Message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg flex items-center space-x-3"
              style={{ backgroundColor: 'var(--color-accent-error)', color: 'white' }}
            >
              <FiAlertCircle className="text-xl flex-shrink-0" />
              <span className="text-sm">{loginError}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className={`w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-white ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    borderColor: errors.email ? 'var(--color-accent-error)' : 'var(--color-dark-400)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm" 
                  style={{ color: 'var(--color-accent-error)' }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-white ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    borderColor: errors.password ? 'var(--color-accent-error)' : 'var(--color-dark-400)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-gray-500 hover:text-gray-400 transition-colors" />
                  ) : (
                    <FiEye className="text-gray-500 hover:text-gray-400 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm" 
                  style={{ color: 'var(--color-accent-error)' }}
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded focus:ring-[var(--color-accent-primary)]"
                  style={{ 
                    accentColor: 'var(--color-accent-primary)'
                  }}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <Link 
                to="/admin/forgot-password" 
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full px-8 py-4 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))'
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </motion.button>

          

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-400">
              Don't have an admin account?{' '}
              <Link 
                to="/admin/signup" 
                className="font-medium hover:underline"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        {/* Security badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center space-x-6"
        >
          {[
            { icon: FiShield, text: '256-bit SSL' },
            { icon: FiLock, text: 'Secure Login' },
            { icon: FiAlertCircle, text: '2FA Ready' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <item.icon className="text-sm" style={{ color: 'var(--color-accent-primary)' }} />
              <span className="text-xs text-gray-500">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;