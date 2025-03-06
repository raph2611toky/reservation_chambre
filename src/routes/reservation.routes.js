const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const reservationServices = require("../services/database/reservation.services");
const { IsAuthenticatedAdmin } = require("../middlewares/auth.middleware");
// const { updateRoomValidationRules, createRoomValidationRules } = require("../validators/room.validator");
// const validateHandler = require("../middlewares/error.handler");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: section pour gérer les reservations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user_id
 *         - room_id
 *         - date_debut
 *         - date_fin
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: ID unique auto-incrémenté
 *         user_id:
 *           type: integer
 *           format: int64
 *           description: ID de l'utilisateur     
 *         room_id:
 *           type: integer
 *           format: int64
 *           description: ID de la chambre
 *         date_debut:
 *           type: string
 *           format: date-time
 *           description: Début de la réservation
 *         date_fin:
 *           type: string
 *           format: date-time
 *           description: Fin de la réservation
 *         status:
 *           type: string
 *           description: Statut de la réservation
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *       example:
 *         id: 1
 *         user_id: 2
 *         room_id: 3
 *         status: "ATTENTE"
 *         date_debut: "2024-03-02T12:00:00Z"
 *         date_fin: "2024-03-05T12:00:00Z"
 *         created_at: "2024-03-02T12:00:00Z"
 *         updated_at: "2024-03-02T12:00:00Z"
 *         montant: 300
 * 
 *     ReservationStatsResponse:
 *       type: object
 *       properties:
 *         reservationStats:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 200
 *             attente:
 *               type: integer
 *               example: 30
 *             confirme:
 *               type: integer
 *               example: 120
 *             refuse:
 *               type: integer
 *               example: 20
 *             annuler:
 *               type: integer
 *               example: 30
 *         incomeStats:
 *           type: object
 *           properties:
 *             totalIncome:
 *                  type: number
 *                  format: float
 *                  example: 50000.00
 *             incomeByCategory:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: "Suite"
 *                   totalIncome:
 *                     type: number
 *                     format: float
 *                     example: 20000.00
 *         roomStats:
 *           type: object
 *           properties:
 *             mostUsedRoom:
 *               type: object
 *               nullable: true
 *               properties:
 *                 room:
 *                   type: string
 *                   example: "Suite 101"
 *                 totalHours:
 *                   type: number
 *                   format: float
 *                   example: 500.0
 *             leastUsedRoom:
 *               type: object
 *               nullable: true
 *               properties:
 *                 room:
 *                   type: string
 *                   example: "Chambre 303"
 *                 totalHours:
 *                   type: number
 *                   format: float
 *                   example: 50.0
 */



/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtenir tous les reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Liste des reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/", reservationController.getAll);

/**
 * @swagger
 * /api/reservations/find/{id}:
 *   get:
 *     summary: Obtenir un reservation
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du reservation 
 *     responses:
 *       200:
 *         description: Détails du reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get("/find/:id", reservationController.getById);


/**
 * @swagger
 * /api/reservations/make:
 *   post:
 *     summary: Faire une reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Erreur de validation
 */
router.post("/make",reservationController.makeReservation);


/**
 * @swagger
 * /api/reservations/update/{id}:
 *   put:
 *     summary: Mettre à jour un reservation
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du reservation à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation non trouvé
 */
router.put("/update/:id", reservationController.updateReservation);


/**
 * @swagger
 * /api/reservations/cancel/{id}:
 *   post:
 *     summary: Annuler une reservation
 *     tags: [Reservations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du reservation à annuler
 *     responses:
 *       200:
 *         description: Annuler une reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.post("/cancel/:id", reservationController.cancelReservation);


/**
 * @swagger
 * /api/reservations/stats:
 *   get:
 *     summary: Obtenir les statistiques des réservations
 *     tags: 
 *       - Statistics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des réservations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReservationStatsResponse"
 *       401:
 *         description: Non autorisé, jeton d'authentification manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/stats", IsAuthenticatedAdmin, reservationController.getStats);


module.exports = router;

