import TokenService from "../../../shared/generate_token.js";
import ReferralCodeGenerator from "../../../shared/generateCode.js";
import MailService from "../../../shared/nodemailer.js";
import BuyerAuthRepository from "../infrastructure/buyerAuthRepository.js";
import bcrypt from 'bcryptjs'

class BuyerAuthService {
    constructor() {
        this.repository = new BuyerAuthRepository()
        this.generateReferralCode = new ReferralCodeGenerator(6)
        this.MailService = new MailService()
    }

    async buyerSignup(buyerSignupData) {
        const exist = await this.repository.findByEmailOrPhone(buyerSignupData.email, buyerSignupData.phoneNumber);
        if (exist) {
            if (exist.email === buyerSignupData.email) {
                throw new Error("Email is already taken.");
            } else if (exist.phoneNumber === buyerSignupData.phoneNumber) {
                throw new Error("Phone number is already taken.");
            }
        }

        let referralCode;
        let isUnique = false;
        let retryCount = 0;
        const maxRetries = 10;

        while (!isUnique && retryCount < maxRetries) {
            referralCode = this.generateReferralCode.generate(buyerSignupData.firstName)

            const existingBuyer = await this.repository.findByCode(referralCode);
            if (!existingBuyer && this.generateReferralCode.validate(referralCode)) {
                isUnique = true;
            }
            retryCount++;
        }

        if (!isUnique) {
            this.throwError("Failed to generate a unique referral code. Please try again.");
        }

        buyerSignupData.referralCode = referralCode

        const hashedPass = await bcrypt.hash(buyerSignupData.password, 10);

        buyerSignupData.password = hashedPass;

        if (this.generateReferralCode.validate(buyerSignupData.referredBy)) {
            const updated = await this.repository.updateReferrals(buyerSignupData.referredBy);
            if (updated.count === 0) {
                buyerSignupData.referredBy = "";
            }
        }

        const newBuyer = await this.repository.create(buyerSignupData);

        if (!newBuyer) {
            this.throwError("Failed to create buyer");
        }

        const token = new TokenService();

        return { ...newBuyer, token: token.generateToken(newBuyer._id) };
    }

    async buyerSignin(buyerSigninData) {
        const buyer = await this.repository.findByEmail(buyerSigninData.email);
        if (!buyer) {
            throw new Error("You don't have an account")
        }
        if (!bcrypt.compareSync(buyerSigninData.password, buyer.password)) {
            throw new Error('Incorrect password')
        }
        const token = new TokenService();
        return { ...buyer, token: token.generateToken(buyer._id) };
    }
}

export default BuyerAuthService;