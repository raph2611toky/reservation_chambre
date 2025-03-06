const Notification = require("../models/notification.model");
const { sendEmail } = require("../services/notifications/email")
const { sendWhatshapp } = require('../services/notifications/whatshapp')
const User = require("../models/user.model")

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

module.exports.sendNotification = async function (id_user, message_to_send, title) {
    const user = await User.getById(id_user);
    if (!user) {
        return { success: false, error: "Profil non trouvé" };
    }
    try{    
        const emailIsSent = await sendEmail(user.email, title, user.name, message_to_send);
        if (emailIsSent) {
            await Notification.create({
                receiver_id: user.id,
                type: 'MAIL',
                contenu: message_to_send,
                created_at: new Date(),
                updated_at: new Date()
            });
        }
        const whatsappIsSent = await sendWhatshapp(user.phone, message_to_send)
        if (whatsappIsSent) {
            await Notification.create({
                receiver_id: user.id,
                type: 'WHATSAPP',
                contenu: message_to_send,
                created_at: new Date(),
                updated_at: new Date()
            });
        }
        return true
    }catch(e){
        console.log(e);
        return false
    }
}