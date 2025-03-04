const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Room = require("../../models/room.model");

class RoomService {
  async getAllRooms() {
    const rooms = await prisma.room.findMany();
    return rooms.map(r => new Room(r.id, r.label, r.description, r.tarif, r.category, r.visit_url,r.created_at, r.updated_at));
  }

  async getRoomById(id) {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return null;
    return new Room(room.id, room.label, room.description, room.tarif, room.category, room.visit_url,room.created_at, room.updated_at);
  }

  async createRoom(data) {
    const newRoom = await prisma.room.create({ data });
    return new Room(newRoom.id, newRoom.label, newRoom.description, newRoom.tarif, newRoom.category, newRoom.visit_url, newRoom.created_at, newRoom.updated_at);
  }

  async updateRoom(id, data) {
    const updatedRoom = await prisma.room.update({ where: { id }, data });
    return new Room(updatedRoom.id, updatedRoom.label, updatedRoom.description, updatedRoom.tarif, updatedRoom.category, updatedRoom.visit_url, updatedRoom.created_at, updatedRoom.updated_at);
  }

  async deleteRoom(id) {
    return await prisma.rooms.delete({ where: { id } });
  }

  async filterRoomByCategory() {
    try {
      const rooms = await prisma.room.findMany();
      var res = {}; 
      rooms.forEach(room => {
          if (!res[room.category]) {
            res[room.category] = []; 
          }
          res[room.category].push(room); 
        });
      return res;

    } catch (error) {
      console.log(error);
      return error;
    }
  }  
  
  // avalaibility
  async isAvailable(roomId, startDate, endDate) {
    const reservations = await prisma.reservation.findMany({
      where: {
        room_id: roomId,
        status: "CONFIRME",
        OR: [
          {
            date_debut: { lte: endDate },
            date_fin: { gte: startDate }
          }
        ]
      },
      select: {
        date_debut: true,
        date_fin: true,
      }
    });
  
    if (reservations.length === 0) {
      return true; 
    }
  
    return false; 
  }
  

  async getAvailableRooms(startDate, endDate) {
    const allRooms = await prisma.room.findMany();
  
    const reservedRooms = await prisma.reservation.findMany({
      where: {
        status: "CONFIRME",
        OR: [
          {
            date_debut: { lte: endDate },
            date_fin: { gte: startDate }
          }
        ]
      },
      select: {
        room_id: true,
      }
    });
  
    const reservedRoomIds = reservedRooms.map(res => res.room_id);
  
    const availableRooms = allRooms.filter(room => !reservedRoomIds.includes(room.id));
  
    return availableRooms;
  }
  

  
  async getRoomSchedule(roomId, date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
  
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Récupérer les réservations de la journée
      const reservations = await prisma.reservation.findMany({
        where: {
          room_id: roomId,
          status: "CONFIRME",
          OR: [
            { date_debut: { gte: startOfDay, lte: endOfDay } },
            { date_fin: { gte: startOfDay, lte: endOfDay } }
          ]
        }
      });
  
      // Trier les réservations par heure de début
      const occupiedIntervals = reservations
        .map(r => ({
          start: r.date_debut,
          end: r.date_fin
        }))
        .sort((a, b) => a.start - b.start);
  
      // Calculer les créneaux disponibles
      const availableIntervals = [];
      let lastEnd = startOfDay;
  
      for (const interval of occupiedIntervals) {
        if (lastEnd < interval.start) {
          availableIntervals.push({ start: lastEnd, end: interval.start });
        }
        lastEnd = interval.end > lastEnd ? interval.end : lastEnd;
      }
  
      // Ajouter le dernier créneau libre jusqu'à la fin de la journée
      if (lastEnd < endOfDay) {
        availableIntervals.push({ start: lastEnd, end: endOfDay });
      }
  
      return { occupiedIntervals, availableIntervals };
    } catch (error) {
      console.log(error);
      return { occupiedIntervals: [], availableIntervals: [] };
    }
  }
  

}

module.exports = new RoomService();
