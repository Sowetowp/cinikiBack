import expressAsyncHandler from "express-async-handler";
import BuyerAuthService from "../../application/buyerAuthService.js";
import Buyer from "../../domain/buyer.js";

class BuyerAuthController {
    constructor() {
        this.service = new BuyerAuthService();
    }

    buyerSignup = expressAsyncHandler(async (req, res) => {
        const buyerData = new Buyer(req.body);
        const buyer = await this.service.buyerSignup(buyerData);

        if (!buyer) {
            res.status(500).json({ message: 'Failed to create buyer' });
        }
        
        return res.status(201).json({
            message: "Buyer created successfully",
            status: 'ok',
            data: buyer
        });
    });
}

export default BuyerAuthController;