import express from "express";
import BuyerAuthController from "../controllers/buyerAuthController.js";
import BuyerSignupDto from "../dto/buyerSignupDto.js";

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
        this.router.post("/", BuyerSignupDto, this.controller.buyerSignup);
    }
}

export default new BuyerAuthRoutes().getRouter();