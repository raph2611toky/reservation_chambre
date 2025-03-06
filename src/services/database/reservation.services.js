const { PrismaClient, Prisma, StatutReservation } = require("@prisma/client");
const prisma = new PrismaClient();
const Reservation = require("../../models/reservation.model");

class ReservationService {
  async getAll() {
    const reservation = await prisma.reservation.findMany();
    return reservation.map(r => 
      new Reservation(r.id, r.user_id, r.user, r.room_id, r.room, r.status, r.date_debut, r.date_fin, r.created_at, r.updated_at));
  }

  async getById(id) {
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return null;
    return new Reservation(reservation.id, reservation.user_id, reservation.user, reservation.room_id, reservation.room, reservation.status, reservation.date_debut, reservation.date_fin, reservation.created_at, reservation.updated_at);
  }
  
  async makeReservation(data) {
    const newReservation = await prisma.reservation.create({ data });
    return new Reservation(newReservation.id, newReservation.user_id, newReservation.user, newReservation.room_id, newReservation.room, newReservation.status, newReservation.date_debut, newReservation.date_fin, newReservation.created_at, newReservation.updated_at);
  }
  
  async updateReservation(id, data) {
    const updatedReservation = await prisma.reservation.update({ where: { id }, data });
    return new Reservation(updatedReservation.id, updatedReservation.user_id, updatedReservation.user, updatedReservation.room_id, updatedReservation.room, updatedReservation.status, updatedReservation.date_debut, updatedReservation.date_fin, updatedReservation.created_at, updatedReservation.updated_at);
  }

  async cancelRervation(id){
    const canceledReservation = await prisma.reservation.update({ 
      where: { id }, 
      data: {status: StatutReservation.ANNULER} });
    return new Reservation(canceledReservation.id, canceledReservation.user_id, canceledReservation.user, canceledReservation.room_id, canceledReservation.room, canceledReservation.status, canceledReservation.date_debut, canceledReservation.date_fin, canceledReservation.created_at, canceledReservation.updated_at);
  }

  async getStats() {
    try {
      console.log("🚀 Début du calcul des statistiques...");

      const reservations = await prisma.reservation.findMany({
        select: {
          status: true,
          montant: true,
          date_debut: true,
          date_fin: true,
          room: {
            select: { id: true, label: true, category: true }
          }
        }
      });

      console.log("📊 Données des réservations récupérées:", reservations.length);

      let total = 0, attente = 0, confirme = 0, refuse = 0, annuler = 0;
      let totalIncome = 0;

      const incomeByCategory = [];
      const roomUsage = [];
      const categoryMap = new Map();
      const roomMap = new Map();

      reservations.forEach((res) => {
        total++;

        switch (res.status) {
          case "ATTENTE": attente++; break;
          case "CONFIRME": confirme++; break;
          case "REFUSE": refuse++; break;
          case "ANNULER": annuler++; break;
        }

        if (res.status === "CONFIRME") {
          totalIncome += res.montant || 0;

          if (!categoryMap.has(res.room.category)) {
            categoryMap.set(res.room.category, 0);
          }
          categoryMap.set(res.room.category, categoryMap.get(res.room.category) + res.montant);
        }

        const duree = (new Date(res.date_fin) - new Date(res.date_debut)) / (1000 * 60 * 60);
        if (!roomMap.has(res.room.id)) {
          roomMap.set(res.room.id, { totalHours: 0, label: res.room.label });
        }
        roomMap.get(res.room.id).totalHours += duree;
      });

      // console.log("✅ Statistiques calculées");

      categoryMap.forEach((totalIncome, category) => {
        incomeByCategory.push({ category, totalIncome });
      });

      roomMap.forEach((data) => {
        roomUsage.push(data);
      });

      let mostUsedRoom = null, leastUsedRoom = null;
      if (roomUsage.length > 0) {
        mostUsedRoom = roomUsage.reduce((max, room) => (room.totalHours > max.totalHours ? room : max));
        leastUsedRoom = roomUsage.reduce((min, room) => (room.totalHours < min.totalHours ? room : min));
      }

      // console.log("🚀 Fin de getStats, retour des données...");
      return {
        reservationStats: { total, attente, confirme, refuse, annuler },
        incomeStats: { totalIncome, incomeByCategory },
        roomStats: {
          mostUsedRoom: mostUsedRoom ? { room: mostUsedRoom.label, totalHours: mostUsedRoom.totalHours } : null,
          leastUsedRoom: leastUsedRoom ? { room: leastUsedRoom.label, totalHours: leastUsedRoom.totalHours } : null
        }
      }
    } catch (error) {
      console.error("❌ Erreur dans getStats:", error);
      throw new Error("Erreur lors de la récupération des statistiques");
    }
  }
}

module.exports = new ReservationService();
