const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { updateRoomValidationRules, createRoomValidationRules } = require("../validators/room.validator");
const validateHandler = require("../middlewares/error.handler");
const { IsAuthenticatedAdmin } = require("../middlewares/auth.middleware");

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
 *           type: int
 *           description: ID unique auto incrémente
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
 *         id: 1
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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Chambre 001"
 *               description:
 *                 type: string
 *                 example: "2 lits avec une baignoire, wifi et Netflix"
 *               tarif:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: "VIP"
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
router.post("/",IsAuthenticatedAdmin, 
    createRoomValidationRules,
    validateHandler,
    roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Mettre à jour un chambre
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
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
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Chambre 001"
 *               description:
 *                 type: string
 *                 example: "2 lits avec une baignoire, wifi et Netflix"
 *               tarif:
 *                 type: number
 *                 format: float
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: "VIP"
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
router.put("/:id", IsAuthenticatedAdmin,
    updateRoomValidationRules, 
    validateHandler,
    roomController.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Supprimer une chambre
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
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
router.delete("/:id", IsAuthenticatedAdmin, roomController.deleteRoom);


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
router.get("/filter", roomController.getFilterRoomByCategory);


/**
 * @swagger
 * /api/rooms/is-available/{id}:
 *   post:
 *     summary: Obtenir si une chambre est disponible entre une intervalle de temps 
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du chambre à vérifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-04T12:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2025-03-05T12:00:00Z"
 *             required:
 *               - start_date
 *               - end_date
 *     responses:
 *       200:
 *         description: Success Action
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 */
router.post("/is-available/:id", roomController.isRoomAvaible);


/**
 * @swagger
 * /api/rooms/availability:
 *   post:
 *     summary: Recherche des chambres disponibles pendant une intervalles de temps  
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-04T12:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2025-03-05T12:00:00Z"
 *             required:
 *               - start_date
 *               - end_date
 *     responses:
 *       200:
 *         description: Liste des chambres disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.post("/availability", roomController.getAvailableRooms);


/**
 * @swagger
 * /api/rooms/planning/{id}:
 *   post:
 *     summary: Obtenir le planning de disponibilité d'un chambre à une date 
 *     tags: [Rooms]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du chambre à vérifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-04T12:00:00Z"
 *             required:
 *               - date
 *     responses:
 *       200:
 *         description: Planing du chambre dans la date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router.post("/planning/:id", roomController.getRoomSchedule);

/**
 * @swagger
 * /api/rooms/stats:
 *   get:
 *     summary: Obtenir tous les statistiques des chambres
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des chambres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRooms:
 *                   type: integer
 *                   example: 50
 *                 totalCategories:
 *                   type: integer
 *                   example: 3
 *                 roomsByCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "Suite"
 *                       count:
 *                         type: integer
 *                         example: 10
 */
router.get("/stats", IsAuthenticatedAdmin, roomController.getRoomStats);


module.exports = router;
