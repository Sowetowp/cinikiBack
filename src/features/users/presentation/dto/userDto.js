import Joi from "joi";
import Validator from "../../../../shared/validate.js";

class UserDto {
    static verifyId(req, res, next) {
        const schema = Joi.object({
            id: Joi.number()
                .integer()
                .positive()
                .required()
                .messages({
                    "number.base": "ID must be a number",
                    "number.integer": "ID must be an integer",
                    "number.positive": "ID must be a positive number",
                    "any.required": "ID is required",
                }),
        });

        Validator.validateRequest(req, next, schema, req.params);
    }
}

export default UserDto;