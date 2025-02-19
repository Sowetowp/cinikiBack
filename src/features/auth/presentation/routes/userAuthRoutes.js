import express from "express";
import UserAuthController from "../controllers/UserAuthController.js";
import UserAuthDto from "../dto/userAuthDto.js";

class UserAuthRoutes {
    constructor() {
        this.controller = new UserAuthController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    getRouter() {
        return this.router;
    }

    initializeRoutes() {
        this.router.post("/signup", UserAuthDto.userSignupDto, this.controller.userSignup);
        this.router.post("/signin", UserAuthDto.userSigninDto, this.controller.userSignin);
        this.router.post("/sendotp", UserAuthDto.sendOTP, this.controller.userSendOTP);
        this.router.post("/verifyotp", UserAuthDto.verifyOTP, this.controller.userVerifyOTP);
    }
}

export default new UserAuthRoutes().getRouter();