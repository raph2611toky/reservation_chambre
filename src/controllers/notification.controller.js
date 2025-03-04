const Notification = require("../models/notification.model");

module.exports.listNotifications = async function (req, res) {
    try {
        const notifications = await Notification.getAll();
        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        res.status(500).json({ message: "Erreur interne du serveur.", error: error.message });
    }
};
    
module.exports.deleteNotification = async function(req, res) {
    const { id } = req.params;
    try {
        await Notification.delete(parseInt(id));
        res.status(200).json({
            success: true,
            message: "Notification supprimée avec succès."
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la notification:", error);
        res.status(500).json({
            success: false,
            message: "Erreur interne du serveur.",
            error: error.message
        });
    }
};

