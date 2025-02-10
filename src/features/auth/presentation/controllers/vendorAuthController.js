import expressAsyncHandler from "express-async-handler";
import VendorAuthService from "../../application/vendorAuthService.js";
import Vendor from "../../domain/vendor.js";

class VendorAuthController {
    constructor() {
        this.service = new VendorAuthService();
    }

    vendorSignup = expressAsyncHandler(async (req, res) => {
        const vendorData = new Vendor(req.body);
        const vendor = await this.service.vendorSignup(vendorData);

        if (!vendor) {
            res.status(500).json({ message: 'Failed to create vendor' });
        }
        
        return res.status(201).json({
            message: "Vendor created successfully",
            status: 'ok',
            data: vendor
        });
    });

    vendorSignin = expressAsyncHandler(async (req, res) => {
        const vendorData = new Vendor(req.body);
        const vendor = await this.service.vendorSignin(vendorData);

        if (!vendor) {
            res.status(500).json({ message: 'Failed to signin vendor' });
        }
        
        return res.status(201).json({
            message: "Vendor signin successfully",
            status: 'ok',
            data: vendor
        });
    });
}

export default VendorAuthController;