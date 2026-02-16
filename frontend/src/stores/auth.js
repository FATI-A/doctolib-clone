import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthed: (s) => !!s.user,
    role: (s) => s.user?.role ?? null,
  },
  actions: {
    async bootstrap() {
      this.loading = true;
      try {
        this.user = await api.me();
      } finally {
        this.loading = false;
      }
    },

    async login(payload) {
      this.error = null;
      this.loading = true;
      try {
        this.user = await api.login(payload);
      } catch (e) {
        this.error = e?.message || "Erreur login";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async register(payload) {
      this.error = null;
      this.loading = true;
      try {
        this.user = await api.register(payload);
      } catch (e) {
        this.error = e?.message || "Erreur inscription";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await api.logout();
      this.user = null;
    },
  },
});