import bcrypt from 'bcryptjs'
import UserAuthRepository from "../infrastructure/userAuthRepository.js";
import ReferralCodeGenerator from "../../../shared/generateCode.js";
import TokenService from "../../../shared/generate_token.js";
import MailService from '../../../shared/nodemailer.js';

class UserAuthService {
    constructor() {
        this.repository = new UserAuthRepository
        this.generateReferralCode = new ReferralCodeGenerator(6)
        this.MailService = new MailService()
    }

    async userSignup(signupData) {
        const userExist = await this.repository.findFirst({
            OR: [
                { email: signupData.email },
                { phoneNumber: signupData.phoneNumber }
            ]
        });

        if (userExist) {
            if (userExist.email === signupData.email) {
                throw new Error("Email is already taken.");
            } else if (userExist.phoneNumber === signupData.phoneNumber) {
                throw new Error("Phone number is already taken.");
            }
        }

        let referralCode;
        let isUnique = false;
        let retryCount = 0;
        const maxRetries = 10;

        while (!isUnique && retryCount < maxRetries) {
            referralCode = this.generateReferralCode.generate(signupData.firstName)

            const existingUser = await this.repository.findOne({
                referralCode: referralCode,
            });

            if (!existingUser && this.generateReferralCode.validate(referralCode)) {
                isUnique = true;
            }

            retryCount++;
        }

        if (!isUnique) {
            throw new Error("Failed to generate a unique referral code. Please try again.");
        }

        signupData.referralCode = referralCode

        const hashedPass = await bcrypt.hash(signupData.password, 10);

        signupData.password = hashedPass;

        if (!this.generateReferralCode.validate(signupData.referredBy)) {
            signupData.referredBy = "";
        } else {
            const verifyCode = await this.repository.updateWithField("referralCode", signupData.referredBy, { referrals: { increment: 1 } });

            if (verifyCode.count === 0) {
                signupData.referredBy = "";
            }
        }

        const newUser = await this.repository.create(signupData);

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        const token = new TokenService();

        return { ...newUser, token: token.generateToken(newUser._id) };
    }

    async userSignin(signinData) {
        const user = await this.repository.findOne({
            email: signinData.email
        });

        if (!user) {
            throw new Error("You don't have an account")
        }

        if (!bcrypt.compareSync(signinData.password, user.password)) {
            throw new Error('Incorrect password')
        }

        const token = new TokenService();
        return { ...user, token: token.generateToken(user._id) };
    }

    async sendOtp(sendOtpData) {
        const user = await this.repository.findOne({ id: sendOtpData.id })

        if (!user) {
            throw new Error("user not found");
        }

        const generateOtp = this.generateReferralCode.generateRandom(4)

        const sendMail = MailService.sendMail(user.email, "Verify your email", generateOtp)
        if (!sendMail) {
            throw new Error("Failed to send mail");
        }

        const updated = await this.repository.update(sendOtpData.id, { otpCode: generateOtp, otpExpiresAt: new Date(Date.now() + 3 * 60 * 1000) });

        if (!updated) {
            throw new Error("Failed to save otp");
        }
        return { success: true }
    }

    async verifyOtp(VerifyOTPData) {
        const user = await this.repository.findOne({ id: VerifyOTPData.id })

        if (user.otpExpiresAt <= new Date(Date.now())) {
            throw new Error("OTP expired")
        }

        if (!user || user.code !== VerifyOTPData.code) {
            throw new Error("Invalid code");
        }

        const updated = await this.repository.update(user.id, { verifyMail: true });

        if (!updated) {
            throw new Error("Failed to verify user");
        }

        return { success: true }
    }
}

export default UserAuthService;