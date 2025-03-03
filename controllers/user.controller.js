const { comparePassword } = require('../utils/securite/bcrypt');
const jwt = require('../utils/securite/jwt');
const User = require('../models/user');

const register = async (req, res) => {
    try {
        if (req.file) req.body.profile = req.file.filename;
        const user = await User.create(req.body);
        res.status(201).json({ message: 'Utilisateur créé', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const userIsValid = await comparePassword(password, user.password);
        if (!userIsValid) return res.status(401).json({ message: 'Login ou mot de passe incorrect' });

        const token = jwt.generateToken({ id: user._id });
        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const profile = async (req, res) => {
    try {
        const user = req.user;
        res.status(201).json({ message: 'Profile de l\'utilisateur', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = req.user;
        const { name, email, sexe, contact, adresse } = req.body;

        if (req.file) {
            if (user.profile !== 'default.png') {
                const oldPath = path.join(__dirname, '..', 'uploads', 'profiles', user.profile);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            user.profile = req.file.filename;
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;
        user.sexe = sexe ?? user.sexe;
        user.contact = contact ?? user.contact;
        user.adresse = adresse ?? user.adresse;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, profile, updateUser };
