import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import Toast from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    company_name: '',
    business_type: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      setShowToast(true);  
      
      setTimeout(() => {
        navigate('/dashboard', { state: { newUser: true } });
      }, 2000);
    } else {
      setErrors(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      {showToast && (
        <Toast
          message={`🎉 Welcome ${formData.first_name}! Your account has been created successfully!`}
          type="success"
          onClose={() => setShowToast(false)}
          duration={5000}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-2xl mb-4">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
            <h1 className="text-3xl font-bold text-navy-800">Create Account</h1>
            <p className="text-dark-grey-600 mt-2">Start advertising with us today</p>
          </div>

          {/* Register Form */}
          <div className="card">
            {errors.detail && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {errors.detail}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-800 mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Retail, Services, Restaurant"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-dark-grey-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-500 hover:text-cyan-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;