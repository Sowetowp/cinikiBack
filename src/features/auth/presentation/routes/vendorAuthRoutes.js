import express from "express";
import VendorAuthController from "../controllers/vendorAuthController.js";
import VendorAuthDto from "../dto/vendorAuthDto.js";

class VendorAuthRoutes {
    constructor() {
        this.controller = new VendorAuthController;
        this.router = express.Router();
        this.initializeRoutes();
    }

    getRouter() {
        return this.router;
    }

    initializeRoutes() {
        this.router.post("/", VendorAuthDto.VendorSignupDto, this.controller.vendorSignup);
        this.router.post("/signin", VendorAuthDto.VendorSigninDto, this.controller.vendorSignin);
    }
}

export default new VendorAuthRoutes().getRouter();