import { providers, slots } from "../data/fakeDb";

let bookings = []; // en mémoire (fake)
let currentUser = null;

function wait(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

export const api = {
  // --- Auth (fake) ---
  async register({ email, password, role }) {
    await wait();
    currentUser = { id: crypto.randomUUID(), email, role };
    return currentUser;
  },

  async login({ email, password, role }) {
    await wait();
    currentUser = { id: crypto.randomUUID(), email, role };
    return currentUser;
  },

  async logout() {
    await wait();
    currentUser = null;
  },

  async me() {
    await wait();
    return currentUser;
  },

  // --- Providers ---
  async listProviders({ q = "", city = "" } = {}) {
    await wait();
    const query = q.trim().toLowerCase();
    const c = city.trim().toLowerCase();

    return providers.filter((p) => {
      const okQ =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.speciality.toLowerCase().includes(query);

      const okCity = !c || p.city.toLowerCase().includes(c);
      return okQ && okCity;
    });
  },

  async getProvider(id) {
    await wait();
    return providers.find((p) => p.id === id) || null;
  },

  async listSlots(providerId) {
    await wait();
    return slots
      .filter((s) => s.providerId === providerId)
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
  },

  // --- Bookings ---
  async createBooking({ providerId, slotId, customerName }) {
    await wait();
    const slot = slots.find((s) => s.id === slotId && s.providerId === providerId);
    if (!slot) throw new Error("Créneau introuvable");
    if (slot.isBooked) throw new Error("Créneau déjà réservé");

    slot.isBooked = true;

    const booking = {
      id: crypto.randomUUID(),
      providerId,
      slotId,
      customerName,
      createdAt: new Date().toISOString(),
      status: "CONFIRMED",
    };

    bookings.unshift(booking);
    return booking;
  },

  async listMyBookings() {
    await wait();
    return bookings;
  },

  async cancelBooking(bookingId) {
    await wait();
    const b = bookings.find((x) => x.id === bookingId);
    if (!b) throw new Error("Réservation introuvable");

    // libérer le slot
    const slot = slots.find((s) => s.id === b.slotId);
    if (slot) slot.isBooked = false;

    b.status = "CANCELLED";
    return b;
  },
};