import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isPasswordValid = () => {
    const { password } = form;
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup' && !isPasswordValid()) {
      setError("Password must be 8+ characters, include an uppercase letter and number.");
      return;
    }

    try {
      if (activeTab === 'signup') {
        await API.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password
        });
      }

      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/chatDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      {/* Logo & App Name */}
      <div className="mb-8 text-center">
        <img src="/logo.svg" alt="SwiftChat Logo" className="h-16 mx-auto" />
        <h1 className="text-3xl font-bold text-indigo-700">SwiftChat</h1>
      </div>

      {/* Auth Box */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        {/* Tab Toggle */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 font-semibold ${activeTab === 'login' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 font-semibold ${activeTab === 'signup' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div>
              <Label>Name</Label>
              <Input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Label>Password</Label>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              className="pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-600 text-sm"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {activeTab === 'signup' && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>Password must include:</p>
              <ul className="ml-4 list-disc">
                <li className={form.password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                <li className={/[A-Z]/.test(form.password) ? "text-green-600" : ""}>One uppercase letter</li>
                <li className={/\d/.test(form.password) ? "text-green-600" : ""}>One number</li>
              </ul>
            </div>
          )}

          <Button type="submit" className="w-full">
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
