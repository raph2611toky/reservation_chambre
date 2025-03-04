const { rooms } = require("../config/db");
const roomService = require("../services/database/room.services");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ error: "Chambre non trouvé" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: "Erreur de validation" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (error) {
    res.status(404).json({ error: "Chambre non trouvé" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.json({ message: "Chambre supprimé" });
  } catch (error) {
    res.status(404).json({ error: "Chambre non trouvé" });
  }
};

exports.getFilterRoomByCategory = async (req, res)=>{
  try {
    // console.log("in filter room controller");
    rooms = await roomService.filterRoomByCategory();
    res.json(rooms)
  } catch (error) {
    console.log(error);
    
    res.status(404).json({ error: "Chambre non trouvé" })
  }
}
