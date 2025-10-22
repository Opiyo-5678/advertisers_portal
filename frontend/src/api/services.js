import axiosInstance from './axios';

// Auth Services
export const authAPI = {
  login: (username, password) =>
    axiosInstance.post('/accounts/auth/login/', { username, password }),
  
  register: (userData) =>
    axiosInstance.post('/accounts/auth/register/', userData),
  
  logout: (refreshToken) =>
    axiosInstance.post('/accounts/auth/logout/', { refresh: refreshToken }),
  
  getMe: () =>
    axiosInstance.get('/accounts/auth/me/'),
  
  changePassword: (data) =>
    axiosInstance.post('/accounts/auth/change-password/', data),
};

// Ads Services
export const adsAPI = {
  getAll: (params) =>
    axiosInstance.get('/advertisers/ads/', { params }),
  
  getById: (id) =>
    axiosInstance.get(`/advertisers/ads/${id}/`),
  
  create: (data) =>
    axiosInstance.post('/advertisers/ads/', data),
  
  update: (id, data) =>
    axiosInstance.patch(`/advertisers/ads/${id}/`, data),
  
  delete: (id) =>
    axiosInstance.delete(`/advertisers/ads/${id}/`),
  
  getStatistics: (id) =>
    axiosInstance.get(`/advertisers/ads/${id}/statistics/`),
  
  getMyStatistics: () =>
    axiosInstance.get('/advertisers/ads/my_statistics/'),
};

// Bookings Services
export const bookingsAPI = {
  getAll: (params) =>
    axiosInstance.get('/advertisers/bookings/', { params }),
  
  getById: (id) =>
    axiosInstance.get(`/advertisers/bookings/${id}/`),
  
  create: (data) =>
    axiosInstance.post('/advertisers/bookings/', data),
  
  update: (id, data) =>
    axiosInstance.patch(`/advertisers/bookings/${id}/`, data),
  
  cancel: (id, reason) =>
    axiosInstance.post(`/advertisers/bookings/${id}/cancel/`, { reason }),
  
  getCalendar: (params) =>
    axiosInstance.get('/advertisers/bookings/calendar/', { params }),
  
  getMyStatistics: () =>
    axiosInstance.get('/advertisers/bookings/my_statistics/'),
};

// Placements Services
export const placementsAPI = {
  getAll: () =>
    axiosInstance.get('/advertisers/ad-placements/'),
  
  getById: (id) =>
    axiosInstance.get(`/advertisers/ad-placements/${id}/`),
  
  checkAvailability: (id, startDate, endDate) =>
    axiosInstance.get(`/advertisers/ad-placements/${id}/availability/`, {
      params: { start_date: startDate, end_date: endDate },
    }),
};

// Pricing Services
export const pricingAPI = {
  getAll: () =>
    axiosInstance.get('/advertisers/pricing-packages/'),
};

// Files Services
export const filesAPI = {
  getAll: () =>
    axiosInstance.get('/advertisers/files/'),
  
  upload: (formData) =>
    axiosInstance.post('/advertisers/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, data) =>
    axiosInstance.patch(`/advertisers/files/${id}/`, data),
  
  delete: (id) =>
    axiosInstance.delete(`/advertisers/files/${id}/`),
};


// Payments Services
export const paymentsAPI = {
  getAll: (params) =>
    axiosInstance.get('/payments/payments/', { params }),
  
  create: (data) =>
    axiosInstance.post('/payments/payments/', data),
  
  getMyStatistics: () =>
    axiosInstance.get('/payments/payments/my_statistics/'),
};

// Notifications Services
export const notificationsAPI = {
  getAll: () =>
    axiosInstance.get('/advertisers/notifications/'),
  
  markAsRead: (id) =>
    axiosInstance.post(`/advertisers/notifications/${id}/mark_read/`),
  
  markAllAsRead: () =>
    axiosInstance.post('/advertisers/notifications/mark_all_read/'),
};