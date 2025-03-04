const User = require("../models/user.model");
const { generateToken } = require("../utils/securite/jwt");


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.getById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "Profil non trouvé" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = generateToken({ id: newUser.id, role: newUser.role });

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user || !(await User.comparePassword(password, user.password))) {
            return res.status(401).json({ error: "Identifiants invalides" });
        }

        const token = generateToken({ id: user.id, role: user.role });
        res.status(200).json({ user, token });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.update(req.user.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await User.delete(req.user.id);
        res.status(204).send();
    } catch (error) {
        console.error("Erreur lors de la suppression du compte:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};
