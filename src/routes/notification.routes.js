const express = require("express");
const router = express.Router();
const { 
    listNotifications,
    deleteNotification
} = require("../controllers/notification.controller");
const { IsAuthenticatedAdmin } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestion des notifications
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique de la notification
 *         receiver:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID de l'utilisateur recevant la notification
 *             name:
 *               type: string
 *               description: Nom du destinataire
 *             email:
 *               type: string
 *               description: Email du destinataire
 *         type:
 *           type: string
 *           enum: [SMS, WHATSAPP, MESSENGER, MAIL]
 *           description: Type de notification
 *         contenu:
 *           type: string
 *           description: Contenu de la notification
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création de la notification
 *       example:
 *         id: 1
 *         receiver:
 *           id: 3
 *           name: "John Doe"
 *           email: "john.doe@example.com"
 *         type: "MAIL"
 *         contenu: "Votre réservation a été confirmée."
 *         created_at: "2024-03-04T10:00:00.000Z"
 */

 /**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Récupérer toutes les notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             example:
 *               notifications: [
 *                 {
 *                   id: 1,
 *                   receiver: {
 *                     id: 3,
 *                     name: "John Doe",
 *                     email: "john.doe@example.com"
 *                   },
 *                   type: "MAIL",
 *                   contenu: "Votre réservation a été confirmée.",
 *                   created_at: "2024-03-04T10:00:00.000Z"
 *                 }
 *               ]
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */

router.get("/", IsAuthenticatedAdmin, listNotifications);

/**
 * @swagger
 * /api/notifications/delete/{id_notification}:
 *   delete:
 *     summary: Supprimer une notification par ID
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_notification
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notification à supprimer
 *     responses:
 *       200:
 *         description: Notification supprimée avec succès
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Notification supprimée avec succès."
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.get("/delete/:id_notification", IsAuthenticatedAdmin, deleteNotification);

module.exports = router;
