const roomServices = require("../services/database/room.services");
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
    const room = await roomService.getRoomById(parseInt(req.params.id));
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
    const room = await roomService.updateRoom(parseInt(req.params.id), req.body);
    res.json(room);
  } catch (error) {
    res.status(404).json({ error: "Chambre non trouvé" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(parseInt(req.params.id));
    res.json({ message: "Chambre supprimé" });
  } catch (error) {
    res.status(404).json({ error: "Chambre non trouvé" });
  }
};

exports.getFilterRoomByCategory = async (req, res)=>{
  try {
    const rooms = await roomService.filterRoomByCategory();
    res.json(rooms)
  } catch (error) {
    console.log(error);
    
    res.status(404).json({ error: "Chambre non trouvé" })
  }
}

exports.isRoomAvaible = async (req, res)=>{
  try {
    const isAvalaible = await roomService.isAvailable(parseInt(req.params.id),req.body.start_date,req.body.end_date)
    res.json({"isAvailable":isAvalaible});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur", message : error });   
  }
}


exports.getAvailableRooms = async (req, res)=>{
  try {
    const rooms = await roomService.getAvailableRooms(req.body.start_date,req.body.end_date)
    res.json(rooms);
    
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Erreur serveur", error });   
    
  }
}


exports.getRoomSchedule = async (req, res)=>{
  try {
    const rooms = await roomService.getRoomSchedule(parseInt(req.params.id),req.body.date)
    res.json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur", error});       
  }
} 

exports.getRoomStats = async (req, res)=>{
  try{
    const stats = await roomServices.getStats();
    res.json(stats)
  }
  catch(error)
  {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur", error});       
  }
}

