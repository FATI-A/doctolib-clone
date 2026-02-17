import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    role: (state) => state.user?.role || null,
  },
  actions: {
    async login(credentials) {
      const res = await api.post('/auth/login', credentials);
      this.token = res.data.token;
      this.user = { ...res.data.user, role: res.data.role };
      
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.clear();
    }
  }
});