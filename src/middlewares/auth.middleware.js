const jwt = require('../utils/securite/jwt');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Pas de token fournie.' });

    try {
        const decoded = jwt.verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};
