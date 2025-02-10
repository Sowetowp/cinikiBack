import express from "express";
import BuyerAuthController from "../controllers/buyerAuthController.js";
import BuyerAuthDto from "../dto/buyerAuthDto.js";

class BuyerAuthRoutes {
    constructor() {
        this.controller = new BuyerAuthController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    getRouter() {
        return this.router;
    }

    initializeRoutes() {
        this.router.post("/", BuyerAuthDto.BuyerSignupDto, this.controller.buyerSignup);
        this.router.post("/signin", BuyerAuthDto.BuyerSigninDto, this.controller.buyerSignin);
    }
}

export default new BuyerAuthRoutes().getRouter();