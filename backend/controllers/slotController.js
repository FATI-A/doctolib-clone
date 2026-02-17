const Slot = require('../models/Slot');

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; 

    let query = { 
      doctor: doctorId, 
      isAvailable: true 
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const slots = await Slot.find(query).sort({ startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des créneaux" });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const patientId = req.user.id; 

    const slot = await Slot.findById(slotId);

    if (!slot || !slot.isAvailable) {
      return res.status(400).json({ message: "Créneau non disponible" });
    }

    slot.isAvailable = false;
    slot.patient = patientId;
    await slot.save();

    res.json({ message: "Rendez-vous réservé avec succès", slot });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la réservation" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { slotId } = req.params;
    const patientId = req.user.id;

    const slot = await Slot.findById(slotId);

    if (!slot) return res.status(404).json({ message: "Créneau introuvable" });

    if (slot.patient.toString() !== patientId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    slot.isAvailable = true;
    slot.patient = null;
    await slot.save();

    res.json({ message: "Rendez-vous annulé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};

exports.getPatientAppointments = async (req, res) => {
    try {
      const appointments = await Slot.find({ patient: req.user.id })
        .populate('doctor', 'name specialty city')
        .sort({ startTime: 1 });
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
};

exports.getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date } = req.query;

    let query = { doctor: doctorId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const slots = await Slot.find(query)
      .populate('patient', 'name email')
      .sort({ startTime: 1 });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du planning" });
  }
};

exports.createSlot = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const doctorId = req.user.id;

    const newSlot = new Slot({
      doctor: doctorId,
      startTime,
      endTime,
      isAvailable: true
    });

    await newSlot.save();
    res.status(201).json(newSlot);
  } catch (err) {
    res.status(500).json({ message: "Erreur création créneau" });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findById(id);

    if (!slot) return res.status(404).json({ message: "Créneau introuvable" });
    if (slot.doctor.toString() !== req.user.id) return res.status(403).json({ message: "Non autorisé" });

    await Slot.findByIdAndDelete(id);
    res.json({ message: "Créneau supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression" });
  }
};