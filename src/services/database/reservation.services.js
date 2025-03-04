const { PrismaClient, Prisma } = require("@prisma/client");
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
    const canceledReservation = await prisma.reservation.update({ where: { id }}, {"status": prisma.reservation.fields.status} );
    return new Reservation(canceledReservation.id, canceledReservation.user_id, canceledReservation.user, canceledReservation.room_id, canceledReservation.room, canceledReservation.status, updatedReservation.date_debut, updatedReservation.date_fin, updatedReservation.created_at, updatedReservation.updated_at);
  }

}

module.exports = new ReservationService();
