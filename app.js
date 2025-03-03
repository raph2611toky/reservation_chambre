require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');
const swaggerDocs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

connectDB();

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(mongoSanitize());

// Routes
app.use('/api/users', require('./routes/user.routes'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gestion des erreurs avec mon Handler personalisé
app.use(require('./middlewares/error.handler'));

swaggerDocs(app);

// Configuration
app.listen(PORT, HOST, () => {
    console.log(`Le serveur est lancé sur ${HOST}:${PORT}`);
});
