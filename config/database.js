const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('[Info] MongoDB connected...');
    } catch (error) {
        console.error('[Erreur] MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
