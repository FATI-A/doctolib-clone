import { defineStore } from "pinia";
import { api } from "../services/api";

export const useBookingsStore = defineStore("bookings", {
  state: () => ({
    myBookings: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMyBookings() {
      this.loading = true;
      this.error = null;
      try {
        this.myBookings = await api.listMyBookings();
      } catch (e) {
        this.error = e?.message || "Erreur chargement RDV";
      } finally {
        this.loading = false;
      }
    },

    async book({ providerId, slotId, customerName }) {
      this.error = null;
      const booking = await api.createBooking({ providerId, slotId, customerName });
      this.myBookings.unshift(booking);
      return booking;
    },

    async cancel(bookingId) {
      this.error = null;
      const updated = await api.cancelBooking(bookingId);
      const i = this.myBookings.findIndex((b) => b.id === bookingId);
      if (i >= 0) this.myBookings[i] = { ...updated };
      return updated;
    },
  },
});