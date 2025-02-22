import UserRepository from "../infrastructure/userRepository.js";

class UserService {
    constructor() {
        this.repository = new UserRepository
    }

    async getUserById(userData) {
        const user = await this.repository.findOne({ id: userData.id })
        if (!user) {
            throw new Error("user not found")
        }
        return user
    }
}

export default UserService