import prisma from "../../../config/prisma.js";

class UserAuthRepository {
    constructor() {
        this.model = prisma.user;
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async findOne(query) {
        return await this.model.findUnique({
            where: query,
        });
    }

    async findFirst(query) {
        return await this.model.findFirst({
            where: query,
        });
    }

    async findAll(filter = {}) {
        return await this.model.findMany({
            where: filter,
        });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    async updateWithField(field, value, data) {
        const record = await this.model.findUnique({
            where: { [field]: value },
        });
    
        if (!record) return { count: 0 };
    
        return await this.model.update({
            where: { [field]: value },
            data,
        });
    }   

    async delete(id) {
        return await this.model.delete({
            where: { id },
        });
    }

}

export default UserAuthRepository;