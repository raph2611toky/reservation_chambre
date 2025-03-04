class User {
    constructor(id, name, email, password, sexe, phone, role = "CLIENT", created_at = null, updated_at = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.sexe = sexe;
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

    static async getAll() {
        const users = await prisma.user.findMany();
        return users.map(User.fromPrisma);
    }

    static async create(data) {
        const newUser = await prisma.user.create({ data });
        return User.fromPrisma(newUser);
    }

    static async update(id, data) {
        const updatedUser = await prisma.user.update({ where: { id }, data });
        return User.fromPrisma(updatedUser);
    }

    static async delete(id) {
        return await prisma.user.delete({ where: { id } });
    }
}

module.exports = User;
