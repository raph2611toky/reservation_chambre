const express = require('express');
const multer = require('multer');

const validateUser = require('../validators/user.validator');
const authMiddleware = require('../middlewares/auth.middleware');
const { register, login, profile, updateUser  } = require('../controllers/user.controller');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'profiles'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-';
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/register', upload.single('profile'), validateUser, register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.put('/update', authMiddleware, upload.single('profile'), validateUser, updateUser);

module.exports = router;
