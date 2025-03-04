const express = require("express");
const router = express.Router();
const { 
    register,
    login,
    updateUser,
    deleteAccount,
    getAllUsers,
    getUser
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             example:
 *               email: "jean.dupont@example.com"
 *               token: "eyJhbGciOi..."
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

module.exports = router;
