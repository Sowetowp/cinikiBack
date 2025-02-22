import express from "express";
import UserController from "../controllers/userController.js";
import UserDto from "../dto/userDto.js";

class UserAuthRoutes {
    constructor() {
        this.controller = new UserController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    getRouter() {
        return this.router;
    }

    initializeRoutes() {
        this.router.get("/getuser/:id", UserDto.verifyId, this.controller.getUserById);
    }
}

export default new UserAuthRoutes().getRouter();