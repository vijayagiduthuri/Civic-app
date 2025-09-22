import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Building2, Lock, Mail, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
 import axios from "axios"; 

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  // Toast management functions
  const addToast = (type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    const toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Official email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid government email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);

    if (!formData.email && !formData.password) {
      addToast('error', 'Required Fields Missing', 'Email and Password are required');
    } else if (!formData.email) {
      addToast('error', 'Required Field Missing', 'Email is required');
    } else if (!formData.password) {
      addToast('error', 'Required Field Missing', 'Password is required');
    } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      addToast('error', 'Invalid Email', 'Enter a valid government email address');
    } else if (formData.password && formData.password.length < 8) {
      addToast('error', 'Password Too Short', 'Password must be at least 8 characters');
    }
    return;
  }

  setIsLoading(true);
  setErrors({});
  addToast('info', 'Authenticating', 'Verifying your credentials...', 1000);

  try {
    const response = await axios.post(
      "http://localhost:9000/api/admin/login",
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setIsLoading(false);

    if (response.data.success) {
      addToast('success', 'Login Successful', 'Welcome back! Redirecting...', 1000);

      // If you later add JWT, you can save it like this:
      // localStorage.setItem("token", response.data.token);
      sessionStorage.setItem("adminEmail", formData.email);

      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    } else {
      addToast('error', 'Authentication Failed', response.data.message || 'Invalid credentials');
    }
  } catch (err) {
    setIsLoading(false);
    console.error("Login error:", err);

    if (err.response) {
      // Server responded with error status
      addToast('error', 'Login Failed', err.response.data.message || 'Invalid credentials');
    } else {
      // Network or other error
      addToast('error', 'Server Error', 'Unable to connect to the server');
    }
  }
};


  // Toast Component
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );

  const Toast = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
      // Trigger entrance animation
      setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(onRemove, 300);
    };

    const getToastStyles = () => {
      const baseStyles = "flex items-start p-4 rounded-lg shadow-lg border max-w-sm transition-all duration-300 transform";
      
      const visibilityStyles = isVisible && !isExiting 
        ? "translate-x-0 opacity-100" 
        : "translate-x-full opacity-0";

      switch (toast.type) {
        case 'success':
          return `${baseStyles} ${visibilityStyles} bg-green-50 border-green-200 text-green-800`;
        case 'error':
          return `${baseStyles} ${visibilityStyles} bg-red-50 border-red-200 text-red-800`;
        case 'warning':
          return `${baseStyles} ${visibilityStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
        case 'info':
        default:
          return `${baseStyles} ${visibilityStyles} bg-blue-50 border-blue-200 text-blue-800`;
      }
    };

    const getIcon = () => {
      switch (toast.type) {
        case 'success':
          return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />;
        case 'error':
          return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
        case 'warning':
          return <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />;
        case 'info':
        default:
          return <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />;
      }
    };

    return (
      <div className={getToastStyles()}>
        {getIcon()}
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="text-sm opacity-90">{toast.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <ToastContainer />
      
      {/* Top Banner - Fixed */}
      <div className="bg-sky-600 border-b-4 border-sky-600 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-sky-600" />
              </div>
              <div className="text-white">
                <div className="text-sm font-semibold">Government of India</div>
                <div className="text-xs opacity-90">Digital India Initiative</div>
              </div>
            </div>
            <div className="text-white text-xs">
              Secure Portal | SSL Encrypted
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-sm lg:max-w-md px-4">
          <div className="mb-8">
            <div className="lg:hidden mb-6">
              <div className="w-12 h-12 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center lg:text-left ml-20">
              Official Portal Access
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center lg:text-left ml-12">
              Sign in with your authorized government credentials
            </p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Official Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500/20'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 text-sm transition-all duration-200`}
                    placeholder="your.name@district.gov.in"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500/20'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 text-sm transition-all duration-200`}
                    placeholder="Enter your secure password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Access Portal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              © 2024 District Collector Office, Government Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;