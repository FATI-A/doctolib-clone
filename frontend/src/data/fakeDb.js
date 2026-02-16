export const providers = [
  {
    id: "p1",
    name: "Coach Amine",
    speciality: "Coaching sportif",
    city: "Paris",
    address: "12 rue de Rivoli",
    description: "Remise en forme, perte de poids, renforcement.",
  },
  {
    id: "p2",
    name: "Salle FitZone",
    speciality: "Salle de sport",
    city: "Lyon",
    address: "8 avenue des Lumières",
    description: "Muscu, cardio, cours collectifs.",
  },
];

export const slots = [
  { id: "s1", providerId: "p1", startAt: "2026-02-18T09:00:00", endAt: "2026-02-18T09:30:00", isBooked: false },
  { id: "s2", providerId: "p1", startAt: "2026-02-18T10:00:00", endAt: "2026-02-18T10:30:00", isBooked: false },
  { id: "s3", providerId: "p2", startAt: "2026-02-19T14:00:00", endAt: "2026-02-19T15:00:00", isBooked: false },
];