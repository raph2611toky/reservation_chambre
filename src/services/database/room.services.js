const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Room = require("../../models/room.model");
const { rooms } = require("../../config/db");

class RoomService {
  async getAllRooms() {
    const rooms = await prisma.rooms.findMany();
    return rooms.map(r => new Room(r.id, r.label, r.description, r.tarif, r.category, r.visit_url,r.created_at, r.updated_at));
  }

  async getRoomById(id) {
    const room = await prisma.rooms.findUnique({ where: { id } });
    if (!room) return null;
    return new Room(room.id, room.label, room.description, room.tarif, room.category, room.visit_url,room.created_at, room.updated_at);
  }

  async createRoom(data) {
    const newRoom = await prisma.rooms.create({ data });
    return new Room(newRoom.id, newRoom.label, newRoom.description, newRoom.tarif, newRoom.category, newRoom.visit_url, newRoom.created_at, newRoom.updated_at);
  }

  async updateRoom(id, data) {
    const updatedRoom = await prisma.rooms.update({ where: { id }, data });
    return new Room(updatedRoom.id, updatedRoom.label, updatedRoom.description, updatedRoom.tarif, updatedRoom.category, updatedRoom.visit_url, updatedRoom.created_at, updatedRoom.updated_at);
  }

  async deleteRoom(id) {
    return await prisma.rooms.delete({ where: { id } });
  }

  async filterRoomByCategory() {
    try {
      const rooms = await prisma.rooms.findMany();

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

  
}

module.exports = new RoomService();
