require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const Patient = require('./models/Patient');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connexion DB pour peuplement massif...");

    await Doctor.deleteMany({});
    await Slot.deleteMany({});
    await Patient.deleteMany({});

    const hash = await bcrypt.hash('password123', 10);

    await new Patient({
      name: "Patient Test",
      email: "patient@test.com",
      password: hash
    }).save();
    console.log("Patient créé (patient@test.com)");

    const doctorsData = [
      { name: "Dr. Medecin 1", specialty: "Généraliste", city: "Paris", email: "medecin1@test.fr", password: hash },
      { name: "Dr. Medecin 2", specialty: "Dentiste", city: "Paris", email: "medecin2@test.fr", password: hash },
      { name: "Dr. Medecin 3", specialty: "Cardiologue", city: "Lyon", email: "medecin3@test.fr", password: hash },
      { name: "Dr. Medecin 4", specialty: "Ophtalmologue", city: "Marseille", email: "medecin4@test.fr", password: hash }
    ];

    const doctors = await Doctor.insertMany(doctorsData);
    console.log(`${doctors.length} médecins créés`);

    const allSlots = [];
    const timeBlocks = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];

      doctors.forEach(doc => {
        timeBlocks.forEach(time => {
          const start = new Date(`${dateString}T${time}:00Z`);
          const end = new Date(start.getTime() + 30 * 60000);

          allSlots.push({
            doctor: doc._id,
            startTime: start,
            endTime: end,
            isAvailable: true,
            patient: null
          });
        });
      });
    }

    await Slot.insertMany(allSlots);
    console.log(`${allSlots.length} créneaux générés sur 7 jours (du ${today.toLocaleDateString()} au ${new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()})`);

    console.log("\n--- INFOS DE CONNEXION ---");
    console.log("Patient : patient@test.com / password123");
    console.log("Premier Docteur : medecin1@test.fr / password123");
    
    process.exit();
  } catch (err) {
    console.error("Erreur lors du seed:", err);
    process.exit(1);
  }
};

seed();