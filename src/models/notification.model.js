const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Notification {
    constructor(id, receiver, type, contenu, created_at, updated_at) {
        this.id = id;
        this.receiver = receiver; // Objet User
        this.type = type;
        this.contenu = contenu;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static fromPrisma(notification) {
        return new Notification(
            notification.id,
            notification.receiver ? {
                id: notification.receiver.id,
                name: notification.receiver.name,
                email: notification.receiver.email
            } : null,
            notification.type,
            notification.contenu,
            notification.created_at,
            notification.updated_at
        );
    }

    static async getById(id) {
        const notification = await prisma.notification.findUnique({
            where: { id },
            include: { receiver: { select: { id: true, name: true, email: true } } }
        });
        return notification ? Notification.fromPrisma(notification) : null;
    }

    static async getAll() {
        const notifications = await prisma.notification.findMany({
            include: { receiver: { select: { id: true, name: true, email: true } } }
        });
        return notifications.map(Notification.fromPrisma);
    }
    
    static async create(data) {
        const newNotification = await prisma.notification.create({
            data,
            include: { receiver: { select: { id: true, name: true, email: true } } }
        });
        return Notification.fromPrisma(newNotification);
    }

    static async delete(id) {
        return await prisma.notification.delete({ where: { id } });
    }

    static async getByUserId(receiver_id) {
        const notifications = await prisma.notification.findMany({
            where: { receiver_id },
            include: { receiver: { select: { id: true, name: true, email: true } } }
        });
        return notifications.map(Notification.fromPrisma);
    }
}

module.exports = Notification;
