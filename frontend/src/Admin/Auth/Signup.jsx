import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useRegisterAdminMutation } from '../../api/adminApi';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const [registerAdmin]=useRegisterAdminMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    // Contains number
    if (/\d/.test(password)) strength += 25;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;
    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[!@#$%^&*]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Call the backend API
      const data = await registerAdmin(formData).unwrap();
    

      // Save token if you want, or redirect
      localStorage.setItem("adminToken", data.token);
      alert("Admin account created successfully!");

    } catch (error) {
    
      setErrors({ submit: error.data?.message || "Failed to create account" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'var(--color-accent-error)';
    if (passwordStrength < 75) return 'orange';
    return 'var(--color-accent-secondary)';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

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
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-dark-300)' }}
              >
                <FiShield className="text-3xl" style={{ color: 'var(--color-accent-primary)' }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent">
                Admin Sign Up
              </span>
            </h2>
            <p className="text-gray-400">Create your administrator account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-white ${
                    errors.fullName ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    borderColor: errors.fullName ? 'var(--color-accent-error)' : 'var(--color-dark-400)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-accent-error)' }}>
                  {errors.fullName}
                </p>
              )}
            </div>

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
                <p className="mt-1 text-sm" style={{ color: 'var(--color-accent-error)' }}>
                  {errors.email}
                </p>
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
                    <FiEyeOff className="text-gray-500 hover:text-gray-400" />
                  ) : (
                    <FiEye className="text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex space-x-1">
                      <div 
                        className="h-1 w-16 rounded-full transition-all"
                        style={{ 
                          backgroundColor: passwordStrength >= 25 ? getPasswordStrengthColor() : 'var(--color-dark-400)'
                        }}
                      />
                      <div 
                        className="h-1 w-16 rounded-full transition-all"
                        style={{ 
                          backgroundColor: passwordStrength >= 50 ? getPasswordStrengthColor() : 'var(--color-dark-400)'
                        }}
                      />
                      <div 
                        className="h-1 w-16 rounded-full transition-all"
                        style={{ 
                          backgroundColor: passwordStrength >= 75 ? getPasswordStrengthColor() : 'var(--color-dark-400)'
                        }}
                      />
                      <div 
                        className="h-1 w-16 rounded-full transition-all"
                        style={{ 
                          backgroundColor: passwordStrength >= 100 ? getPasswordStrengthColor() : 'var(--color-dark-400)'
                        }}
                      />
                    </div>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use at least 8 characters with numbers, uppercase & special characters
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-accent-error)' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all text-white ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  style={{ 
                    backgroundColor: 'var(--color-dark-300)',
                    borderColor: errors.confirmPassword ? 'var(--color-accent-error)' : 'var(--color-dark-400)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-gray-500 hover:text-gray-400" />
                  ) : (
                    <FiEye className="text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-accent-error)' }}>
                  {errors.confirmPassword}
                </p>
              )}
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
                  Creating Account...
                </span>
              ) : 'Create Admin Account'}
            </motion.button>

            {/* Error message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg text-sm text-center"
                style={{ backgroundColor: 'var(--color-accent-error)', color: 'white' }}
              >
                {errors.submit}
              </motion.div>
            )}

            {/* Login link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/admin/login" 
                className="font-medium hover:underline"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Features list */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: FiShield, text: 'Secure Access' },
            { icon: FiCheckCircle, text: 'Full Control' },
            { icon: FiUser, text: 'Profile Management' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: 'var(--color-dark-300)' }}
              >
                <item.icon style={{ color: 'var(--color-accent-primary)' }} />
              </div>
              <p className="text-xs text-gray-400">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;