import TokenService from "../../../shared/generate_token.js";
import ReferralCodeGenerator from "../../../shared/generateCode.js";
import MailService from "../../../shared/nodemailer.js";
import bcrypt from 'bcryptjs'
import VendorAuthRepository from "../infrastructure/vendorAuthRepository.js";

class VendorAuthService {
    constructor() {
        this.repository = new VendorAuthRepository()
        this.generateReferralCode = new ReferralCodeGenerator(6)
        this.MailService = new MailService()
    }

    async vendorSignup(vendorSignupData) {
        const exist = await this.repository.findByEmailOrPhone(vendorSignupData.email, vendorSignupData.phoneNumber);
        if (exist) {
            if (exist.email === vendorSignupData.email) {
                throw new Error("Email is already taken.");
            } else if (exist.phoneNumber === vendorSignupData.phoneNumber) {
                throw new Error("Phone number is already taken.");
            }
        }

        let referralCode;
        let isUnique = false;
        let retryCount = 0;
        const maxRetries = 10;

        while (!isUnique && retryCount < maxRetries) {
            referralCode = this.generateReferralCode.generate(vendorSignupData.firstName)

            const existingVendor = await this.repository.findByCode(referralCode);
            if (!existingVendor && this.generateReferralCode.validate(referralCode)) {
                isUnique = true;
            }
            retryCount++;
        }

        if (!isUnique) {
            this.throwError("Failed to generate a unique referral code. Please try again.");
        }

        vendorSignupData.referralCode = referralCode

        const hashedPass = await bcrypt.hash(vendorSignupData.password, 10);

        vendorSignupData.password = hashedPass;

        if (this.generateReferralCode.validate(vendorSignupData.referredBy)) {
            const updated = await this.repository.updateReferrals(vendorSignupData.referredBy);
            if (updated.count === 0) {
                vendorSignupData.referredBy = "";
            }
        }

        const newVendor = await this.repository.create(vendorSignupData);

        if (!newVendor) {
            this.throwError("Failed to create vendor");
        }

        const token = new TokenService();

        return { ...newVendor, token: token.generateToken(newVendor._id) };
    }

    async vendorSignin(vendorSigninData) {
        const vendor = await this.repository.findByEmail(vendorSigninData.email);
        if (!vendor) {
            throw new Error("You don't have an account")
        }
        if (!bcrypt.compareSync(vendorSigninData.password, vendor.password)) {
            throw new Error('Incorrect password')
        }
        const token = new TokenService();
        return { ...vendor, token: token.generateToken(vendor._id) };
    }
}

export default VendorAuthService;