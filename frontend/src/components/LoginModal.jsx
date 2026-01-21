import React, { useState } from 'react';
import { login, sendOTP, verifyOTP } from '../services/api';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: phone/username, 2: OTP
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendOTP(formData.username, formData.phone_number);
      setSuccess('OTP sent successfully! Check your phone.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(
        formData.phone_number,
        formData.otp,
        formData.username,
        formData.password
      );
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLoginSuccess(response.user);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData.username, formData.password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLoginSuccess(response.user);
      onClose();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      otp: ''
    });
    setStep(1);
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'Login' : (step === 1 ? 'Register - Step 1' : 'Register - Verify OTP')}
          </h2>
          <button onClick={() => { onClose(); resetForm(); }} className="text-slate-400 hover:text-slate-600 text-2xl">
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+91XXXXXXXXXX"
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                maxLength="6"
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                required
              />
              <p className="text-sm text-slate-500 mt-1">OTP sent to {formData.phone_number}</p>
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-2 text-yellow-600 hover:text-yellow-700"
            >
              ← Back
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-yellow-600 hover:text-yellow-700"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
