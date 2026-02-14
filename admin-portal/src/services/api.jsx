import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

/* -------------------- ADD THIS INTERCEPTOR -------------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------- AUTH -------------------- */
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

/* -------------------- USERS -------------------- */
export const userService = {
  getAll: () => api.get('/users'),
};

/* -------------------- BUSINESSES -------------------- */
export const businessService = {
  getAll: (params) => api.get('/businesses', { params }),
  getById: (id) => api.get(`/businesses/${id}`),
  create: (data) => api.post('/businesses', data),
  update: (id, data) => api.put(`/businesses/${id}`, data),
  delete: (id) => api.delete(`/businesses/${id}`),
};

/* -------------------- PRODUCTS -------------------- */
export const productService = {
  create: (data) => api.post("/products", data),
update: (id, data) => api.put(`/products/${id}`, data),
delete: (id) => api.delete(`/products/${id}`),
  getAll: () => api.get('/products'),
};

/* -------------------- PRICES -------------------- */
export const priceService = {
  getAll: (params) => api.get('/prices', { params }),
  create: (data) => api.post('/prices', data),
  update: (id, data) => api.put(`/prices/${id}`, data),
  remove: (id) => api.delete(`/prices/${id}`),
};
/* -------------------- LOTS -------------------- */
export const lotService = {
  getAll: () => api.get('/lots'),
  getById: (id) => api.get(`/lots/${id}`),
  create: (data) => api.post('/lots', data),
  update: (id, data) => api.put(`/lots/${id}`, data),
  delete: (id) => api.delete(`/lots/${id}`),
};


/* -------------------- ANALYTICS (mock) -------------------- */
export const analyticsService = {
  getDashboard: async () => ({
    totalRevenue: 240000,
    users: 892,
    products: 342,
    lots: 156,
  }),
};

export default api;
