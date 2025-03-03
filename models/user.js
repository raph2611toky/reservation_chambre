const mongoose = require('mongoose');
const { hashPassword } = require('../utils/securite/bcrypt');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sexe:     { type: String, enum: ['masculin', 'feminin'], required: true },
    phone:    { type: String, required: true },
    role:     { type: String, default: 'client' , enum: ['client', 'admin']},
    profile:  { type: String, default: 'default.png' },
    created_at: { type: timestamps },
    updated_at: { type: timestamps },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    user.profile = `${process.env.BASE_URL}/uploads/profiles/${user.profile}`;
    delete user.password;
    return user;
};

userSchema.method.isAdmin = function () {
    var isAdmin = false;
    if (this.toObject().role === 'admin'){
        isAdmin = true;
    }
    return isAdmin;
}

module.exports = mongoose.model('User', userSchema);
