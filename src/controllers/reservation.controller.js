const reservationService = require("../services/database/reservation.services");
const roomServices = require("../services/database/room.services");
const { sendNotification } = require("./notification.controller");
const { diffHour } = require("../utils/time/time")

exports.getAll = async (req, res)=>{
    try {
        const reservation = await reservationService.getAll();
        res.json(reservation);
        } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
}

exports.getById = async (req, res)=>{
    try {
        const reservation = await reservationService.getById(parseInt(req.params.id));
        if (!reservation) return res.status(404).json({ error: "Reservation non trouvé" });        
        res.json(reservation);
    }catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Erreur serveur" });
    }
}

exports.makeReservation = async (req, res)=>{
    try {
        data={}
        data.room_id= req.body.room_id
        data.date_debut= req.body.date_debut
        data.date_fin= req.body.date_fin
        data.user_id= parseInt(req.user.id)
        const room = await roomServices.getRoomById(parseInt(req.body.room_id))
        data.montant = parseFloat(diffHour(req.body.date_debut,req.body.date_fin) * room.tarif)
        const reservation = await reservationService.makeReservation(data);
        res.status(201).json(reservation);
    }
    catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Erreur de serveur" });
    }
}

exports.updateReservation = async (req, res) => {
  try {
    data={}
    data.room_id= req.body.room_id
    data.date_debut= req.body.date_debut
    data.date_fin= req.body.date_fin
    const room = await roomServices.getRoomById(parseInt(req.body.room_id))
    data.montant = parseFloat(diffHour(req.body.date_debut,req.body.date_fin) * room.tarif)
    const reservation= await reservationService.updateReservation(parseInt(req.params.id), req.body);
    res.json(reservation);
  } catch (error) {
    console.log(error);
    
    res.status(404).json({ error: "Reservation non trouvé" });
  }
};

exports.cancelReservation = async (req, res) => {
    try {
      const reservation= await reservationService.cancelRervation(parseInt(req.params.id));
      if (!reservation) return res.status(404).json({ error: "Reservation non trouvé" });
      res.json("Reservation Annulé");
    } catch (error) {
        console.log(error);
        
      res.status(404).json({ error: "Reservation non trouvé" });
    }
};


exports.getStats = async (req, res)=> {
  try {
    // console.log("🟢 Envoi de la réponse à l'API...");
    const reservation= await reservationService.getStats();
    // console.log("🔵 Données envoyées:", JSON.stringify(reservation, null, 2)); // Affiche la réponse en JSON
    res.json(reservation);
  } catch (error) {
    console.log("❌ Erreur dans getStats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}


exports.confirmReservation = async (req, res)=>{
  try {
    const reservation= await reservationService.confirmReservation(parseInt(req.params.id));
    const room = await roomServices.getRoomById(reservation.room_id)
    const title = "Reservation Chambre "+ room.label+ " confirmé."
    const message = "Votre Reservation chambre "+ room.label +" est confirmé par les administrateurs.";     
    sendNotification(reservation.user_id,message,title)
    res.json("Reservation Confirmé");
  } catch (error) {
    console.log(error);  
    res.status(500).json({ error: "Erreur serveur." });
  }
}


exports.refuseReservation = async (req, res)=>{
  try {
    const reservation= await reservationService.refuseReservation(parseInt(req.params.id));
    const room = await roomServices.getRoomById(reservation.room_id)
    const title = "Reservation Chambre "+ room.label+ " refusé."
    const message = "Votre Reservation chambre "+ room.label +" est refusé par les administrateurs. Veuillez contacter support pour plus de détails !";     
    sendNotification(reservation.user_id,message,title)
    res.json("Reservation refusé !");
  } catch (error) {
    console.log(error);  
    res.status(500).json({ error: "Erreur serveur." });
  }
}

