import expressAsyncHandler from "express-async-handler";
import UserService from "../../application/userService.js";
import User from "../../domain/user.js";

class UserController {
    constructor() {
        this.service = new UserService();
    }

    getUserById = expressAsyncHandler(async (req, res) => {
        console.log(req.params)
        const userData = new User(req.params);
        const user = await this.service.getUserById(userData);

        if (!user) {
            res.status(500).json({ message: 'Failed to get user' });
        }

        return res.status(201).json({
            message: "user fetched successfully",
            status: 'ok',
            data: user
        });
    });

}

export default UserController;