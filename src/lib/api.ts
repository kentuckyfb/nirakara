import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create an index to manage auth token locally if needed
let authToken = localStorage.getItem('admin-token');

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

export const getProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products', error);
        return [];
    }
};

export const getProduct = async (slug: string) => {
    try {
        const response = await api.get(`/products/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product', error);
        return null;
    }
};

export const getConfig = async () => {
    try {
        const response = await api.get('/config');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch config', error);
        return null;
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        authToken = token;
        localStorage.setItem('admin-token', token);
        return { token, user };
    } catch (error) {
        console.error("Login error", error);
        throw error;
    }
};

export const logout = async () => {
    authToken = null;
    localStorage.removeItem('admin-token');
};

// Admin functions
export const createProduct = async (formData: FormData, token: string) => {
    try {
        // We use the token passed or the one in the interceptor
        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

export const updateProduct = async (id: string, formData: FormData, token: string) => {
    try {
        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        const response = await api.delete(`/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

