module.exports = (req, res, next) => {
    const { name, email, password, sexe, phone, role } = req.body;

    if (!name || !email || !password || !sexe || !phone) {
        return res.status(400).json({ erreur: 'Tous les champs sont requis' });
    }
    if (!['masculin', 'feminin'].includes(sexe)) {
        return res.status(400).json({ erreur: 'Sexe invalide' });
    }
    if(role===null || !['client','admin'].includes(role)){
        return res.status(400).json({erreur: 'Rôle invalide'})
    }
    next();
};
