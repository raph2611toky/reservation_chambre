const express = require("express");
const router = express.Router();
const { 
    register,
    registerAdmin,
    login,
    updateUser,
    deleteAccount,
    getAllUsers,
    getUser,
    logout,
    getUserStats ,
    getUserNotifications,
    updateNotificationPreference
 } = require("../controllers/user.controller");
const { 
    createUserValidationRules, 
    updateUserValidationRules 
} = require("../validators/user.validator");
const validateHandler = require("../middlewares/error.handler");
const { IsAuthenticated, IsAuthenticatedAdmin } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de l'utilisateur
 *         name:
 *           type: string
 *           description: Nom complet de l'utilisateur
 *         email:
 *           type: string
 *           description: Adresse email
 *         password:
 *           type: string
 *           description: Mot de passe
 *         phone:
 *           type: string
 *           description: Numéro de téléphone
 *         role:
 *           type: string
 *           enum: [CLIENT, ADMIN]
 *           description: Rôle de l'utilisateur
 *       example:
 *         name: Jean Dupont
 *         email: jean.dupont@example.com
 *         password: motdepasse123
 *         phone: "0601020304"
 *         role: CLIENT
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             example:
 *               users: [
 *                 {
 *                   id: "123",
 *                   name: "Jean Dupont",
 *                   email: "jean.dupont@example.com",
 *                   phone: "+216 34 26 156 20"
 *                 }
 *               ]
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.get("/", IsAuthenticatedAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             example:
 *               id: "123"
 *               name: "Jean Dupont"
 *               email: "jean.dupont@example.com"
 *               phone: "+261 32 16 125 47"
 *       404:
 *         description: Profil non trouvé
 *         content:
 *           application/json:
 *             example:
 *               error: "Profil non trouvé"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.get("/profile", IsAuthenticated, getUser);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "user@123"
 *               name:
 *                 type: string
 *                 example: "User"
 *               phone:
 *                 type: string
 *                 example: "+261341234567"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             example:
 *               email: "jean.dupont@example.com"
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             example:
 *               error: "Cet utilisateur s'est dejà enregistré"
 */
router.post("/register", createUserValidationRules, validateHandler, register);

/**
 * @swagger
 * /api/users/admin/register:
 *   post:
 *     summary: Enregistrer un administrateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Admin@123"
 *               name:
 *                 type: string
 *                 example: "Admin User"
 *               phone:
 *                 type: string
 *                 example: "+261341234567"
 *     responses:
 *       201:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: admin@example.com
 *       401:
 *         description: L'administrateur existe déjà
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/admin/register", createUserValidationRules, validateHandler, registerAdmin);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             example:
 *               name: "Jean Dupont"
 *               token: "eyJhbGciOi..."
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             example:
 *               error: "Identifiants invalides"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.post("/login", login);

/**
 * @swagger
 * /api/users/change:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               id: "123"
 *               name: "Jean Dupont"
 *               email: "jean.dupont@example.com"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             example:
 *               error: "Données invalides"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.put("/change", IsAuthenticated, updateUserValidationRules, validateHandler, updateUser);
   
/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Compte supprimé avec succès
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.delete("/delete", IsAuthenticated, deleteAccount);

/**
 * @swagger
 * /api/users/logout:
 *   put:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/logout", IsAuthenticated, logout);

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Récupérer les statistiques globales des utilisateurs
 *     description: Retourne le nombre total d'utilisateurs, le nombre d'admins, de clients et d'utilisateurs actifs.
 *     tags: [Statistics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des utilisateurs
 *         content:
 *           application/json:
 *             example:
 *               nombre_total_user: 100
 *               nombre_admin: 10
 *               nombre_client: 90
 *               user_actif: 25
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/stats", IsAuthenticatedAdmin, getUserStats);

/**
 * @swagger
 * /api/users/notifications:
 *   get:
 *     summary: Récupère les notifications de l'utilisateur
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications récupérée avec succès
 *         content:
 *           application/json:
 *             example:
 *               notifications:
 *                 - id: 1
 *                   message: "Nouvelle mise à jour disponible"
 *                   date: "2024-07-08T12:00:00Z"
 *                 - id: 2
 *                   message: "Votre commande a été expédiée"
 *                   date: "2024-07-09T15:30:00Z"
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *         content:
 *           application/json:
 *             example:
 *               error: "Token invalide ou expiré"
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.get("/notifications", IsAuthenticated, getUserNotifications);

/**
 * @swagger
 * /api/users/notification-preference:
 *   patch:
 *     summary: Modifier la préférence de notification de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationType
 *             properties:
 *               notificationType:
 *                 type: string
 *                 enum: [SMS, WHATSAPP, MESSENGER, MAIL]
 *     responses:
 *       200:
 *         description: Préférence mise à jour avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: "Préférence de notification mise à jour avec succès"
 *               preferred_notification: "WHATSAPP"
 *       400:
 *         description: Type de notification invalide
 *         content:
 *           application/json:
 *             example:
 *               error: "Type de notification non valide"
 *       401:
 *         description: Non autorisé - Token invalide
 *         content:
 *           application/json:
 *             example:
 *               error: "Token invalide ou expiré"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             example:
 *               error: "Erreur interne du serveur"
 */
router.patch("/notification-preference", IsAuthenticated, updateNotificationPreference);

module.exports = router;
