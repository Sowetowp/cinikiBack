import expressAsyncHandler from "express-async-handler";
import UserAuthService from "../../application/userAuthServices.js";
import User from "../../domain/user.js";

class UserAuthController {
    constructor() {
        this.service = new UserAuthService();
    }

    userSignup = expressAsyncHandler(async (req, res) => {
        const userData = new User(req.body);
        const user = await this.service.userSignup(userData);

        if (!user) {
            res.status(500).json({ message: 'Failed to create user' });
        }

        return res.status(201).json({
            message: "user created successfully",
            status: 'ok',
            data: user
        });
    });

    userSignin = expressAsyncHandler(async (req, res) => {
        const userData = new User(req.body);
        const user = await this.service.userSignin(userData);

        if (!user) {
            res.status(500).json({ message: 'Failed to signin user' });
        }

        return res.status(201).json({
            message: "User signin successfully",
            status: 'ok',
            data: user
        });
    });

    userSendOTP = expressAsyncHandler(async (req, res) => {
        const userData = new User(req.body);
        const sent = await this.service.sendOtp(userData);

        if (!sent.success) {
            res.status(500).json({ message: 'Failed to send OTP' });
        } else {
            return res.status(201).json({
                message: "OTP sent successfully",
                status: 'ok',
                data: { success: true }
            });
        }
    });

    userVerifyOTP = expressAsyncHandler(async (req, res) => {
        const userData = new User(req.body);
        const sent = await this.service.verifyOtp(userData);

        if (!sent.success) {
            res.status(500).json({ message: 'Failed to verify OTP' });
        } else {
            return res.status(200).json({
                message: "OTP verified successfully",
                status: 'ok',
                data: { success: true }
            });
        }
    });
}

export default UserAuthController;