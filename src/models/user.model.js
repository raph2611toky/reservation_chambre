const bcrypt = require("../utils/securite/bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class User {
    constructor(id, name, email, password, sexe, phone, role = "CLIENT", created_at = null, updated_at = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(user) {
        return new User(user.id, user.name, user.email, user.password, user.sexe, user.phone, user.role, user.created_at, user.updated_at);
    }

    static async getById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user ? User.fromPrisma(user) : null;
    }

    static async findByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        return user ? User.fromPrisma(user) : null;
    }

    static async getAll() {
        const users = await prisma.user.findMany();
        return users.map(User.fromPrisma);
    }

    static async create(data) {
        if (data.password) {
            data.password = await bcrypt.hashPassword(data.password);
        }
        console.log(data);
        
        const newUser = await prisma.user.create({ data });
        return User.fromPrisma(newUser);
    }

    static async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hashPassword(data.password);
        }
        const updatedUser = await prisma.user.update({ where: { id }, data });
        return User.fromPrisma(updatedUser);
    }

    static async delete(id) {
        return await prisma.user.delete({ where: { id } });
    }

    static async comparePassword(password, hashPassword) {
        return bcrypt.comparePassword(password, hashPassword)
    }

    static async countAll() {
        return prisma.user.count();
    }

    static async countByRole(role) {
        return prisma.user.count({ where: { role } });
    }

    static async countActive() {
        return prisma.user.count({ where: { is_active: true } });
    }
}

module.exports = User;
