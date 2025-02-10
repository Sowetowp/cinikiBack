import Joi from "joi";
import Validator from "../../../../shared/validate.js";

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one upper case letter, one lower case letter, one digit, one special character, and at least 8 characters long.";
class BuyerAuthDto {
    static BuyerSignupDto = (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            password: Joi.string()
                .regex(strongPasswordRegex)
                .required()
                .messages({
                    "string.empty": "Password is required",
                    "string.pattern.base": stringPasswordError,
                }),
            firstName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "First name is required",
                    "string.min": "First name must be at least 3 characters",
                    "string.max": "First name must not exceed 20 characters",
                }),
            lastName: Joi.string()
                .required()
                .min(3)
                .max(20)
                .trim()
                .messages({
                    "string.empty": "Last name is required",
                    "string.min": "Last name must be at least 3 characters",
                    "string.max": "Last name must not exceed 20 characters",
                }),
            phoneNumber: Joi.string()
                .required()
                .trim()
                .min(10)
                .max(15)
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 10 characters long",
                    "string.max": "Phone number must be at most 15 characters long"
                }),
            address: Joi.string()
                .required()
                .trim()
                .messages({
                    "string.empty": "Country is required",
                }),
            referredBy: Joi.string().trim().allow('').optional()
        });

        Validator.validateRequest(req, next, schema);
    };

    static BuyerSigninDto = (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                .required()
                .trim()
                .lowercase()
                .messages({
                    "string.email": "Email must be a valid email",
                    "string.empty": "Email is required",
                    "any.required": "Email is a required field",
                }),
            password: Joi.string()
                .regex(strongPasswordRegex)
                .required()
                .messages({
                    "string.empty": "Password is required",
                    "string.pattern.base": stringPasswordError,
                }),
        });

        Validator.validateRequest(req, next, schema);
    };
};
export default BuyerAuthDto;