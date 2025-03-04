const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
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
 *           type: int
 *           description: ID unique auto incrémente
 *         user_id:
 *           type: int
 *           description: ID user     
 *         room_id:
 *           type: string
 *           description: ID du chambre
 *         date_debut:
 *           type: datetime
 *           description: Début reservation
 *         date_fin:
 *           type: datetime
 *           description: Fin reservation
 *         status:
 *           type: string
 *           description: Status reservation
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
 *         status: ATTENTE
 *         date_debut: 2024-03-02T12:00:00Z
 *         date_fin: 2024-03-05T12:00:00Z
 *         created_at: "2024-03-02T12:00:00Z"
 *         updated_at: "2024-03-02T12:00:00Z"
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
 *                 $ref: '#/components/schemas/Rerservation'
 */
router.get("/", reservationController.getAll);

/**
 * @swagger
 * /api/reservations/find/{id}:
 *   get:
 *     summary: Obtenir un reservation
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Détails du reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rerservation'
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
 *     responses:
 *       200:
 *         description: Annuler une reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rerservation'
 */
router.post("/find/:id", reservationController.cancelReservation);


module.exports = router;

