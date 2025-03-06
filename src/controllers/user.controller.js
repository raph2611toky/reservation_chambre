const User = require("../models/user.model");
const { generateToken } = require("../utils/securite/jwt");
const { sendNotification } = require("./notification.controller")

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
        const user = await User.findByEmail(req.body.email);
        if (user) {
            return res.status(401).json({ error: "Cet utilisateur s'est dejà enregistré" });
        }
        const newUser = await User.create({ ...req.body, role: "CLIENT" });
        
        const message_to_send = `Nous vous confirmons que votre inscription sur notre plateforme a été réalisée avec succès.
Vous pouvez dès à présent accéder à votre espace personnel et profiter de nos services.
Si vous avez la moindre question, notre équipe reste à votre disposition.`;
        const title = "Confirmation de votre inscription";
        sendNotification(newUser.id, message_to_send,title)        

        res.status(201).json({ email: newUser.email });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email);
        if (user) {
            return res.status(401).json({ error: "Cet administrateur s'est déjà enregistré" });
        }

        const newAdmin = await User.create({ ...req.body, role: "ADMIN" });

        const message_to_send = `Nous vous confirmons que votre compte administrateur a été créé avec succès.`;
        const title = "Création de votre compte administrateur";
        sendNotification(newAdmin.id, message_to_send, title);

        res.status(201).json({ email: newAdmin.email });
    } catch (error) {
        console.error("Erreur lors de la création de l'administrateur:", error);
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
        await User.update(user.id, { is_active: true });

        const token = generateToken({ id: user.id, role: user.role });
        res.status(200).json({ name: user.name, token });
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

exports.logout = async (req, res) => {
    try {
        await User.update(req.user.id, { is_active: false });
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countAll();
        const totalAdmins = await User.countByRole("ADMIN");
        const totalClients = await User.countByRole("CLIENT");
        const activeUsers = await User.countActive();

        res.status(200).json({
            nombre_total_user: totalUsers,
            nombre_admin: totalAdmins,
            nombre_client: totalClients,
            user_actif: activeUsers
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
};