const app = require("./app.js");

// Définition du port
const PORT = process.env.PORT || 3000;

// Définition de la route GET /api/hello
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur sur http://localhost:${PORT}/api/docs`);
});