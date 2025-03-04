const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { updateRoomValidationRules, createRoomValidationRules } = require("../validators/room.validator");
const validateHandler = require("../middlewares/error.handler");

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: section pour gérer les chambres
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - label
 *         - description
 *         - tarif
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique généré automatiquement
 *         label:
 *           type: string
 *           description: Nom (ou identification) du chambre
 *         description:
 *           type: string
 *           description: Description du chambre
 *         tarif:
 *           type: number
 *           format: float
 *           description: Prix du chambre par journé de séjour
 *         category:
 *           type: string
 *           description: Catégorie du chambre
 *         visit_url:
 *           type: string
 *           description: Url front pour faire la visit virtuelle
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         label: "Chambre 001"
 *         description: "2 lits avec un baingoire, wifi et netflix"
 *         tarif: 99.99
 *         category: "VIP"
 *         created_at: "2024-03-02T12:00:00Z"
 *         updated_at: "2024-03-02T12:00:00Z"
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Obtenir tous les chambres
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Liste des chambres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/", roomController.getRooms);

/**
 * @swagger
 * /api/rooms/find/{id}:
 *   get:
 *     summary: Obtenir un chambre par ID
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du chambre
 *     responses:
 *       200:
 *         description: Détails du chambre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Chambre non trouvé
 */
router.get("/find/:id", roomController.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Créer un chambre
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Chambre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Erreur de validation
 */
router.post("/", 
    createRoomValidationRules,
    validateHandler,
    roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Mettre à jour un chambre
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du chambre à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Chambre mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Chambre non trouvé
 */
router.put("/:id", 
    updateRoomValidationRules, 
    validateHandler,
    roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Supprimer une chambre
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du chambre à supprimer
 *     responses:
 *       200:
 *         description: Chambre supprimé avec succès
 *       404:
 *         description: Chambre non trouvé
 */
router.delete("/:id", roomController.deleteRoom);


/**
 * @swagger
 * /api/rooms/filter:
 *   get:
 *     summary: Obtenir tous les chambres filtré par categorie
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Liste des chambres par category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.get("/filter", roomController.getRooms);


module.exports = router;
