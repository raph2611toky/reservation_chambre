const reservationService = require("../services/database/reservation.services")

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
        const reservation = await reservationService.makeReservation(req.body);
        res.status(201).json(reservation);
    }
    catch (error) {
        console.log(error);
        
        res.status(500).json({ error: "Erreur de serveur" });
    }
}

exports.updateReservation = async (req, res) => {
  try {
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
      res.json(reservation);
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



