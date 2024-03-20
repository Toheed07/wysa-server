const Joi = require("@hapi/joi");

//Register Validation
const registerValidation = async (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return await schema.validateAsync(data, { abortEarly: false });
};

//Log in Validation
const logInValidation = async (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return await schema.validateAsync(data, { abortEarly: false });
};

module.exports.registerValidation = registerValidation;
module.exports.logInValidation = logInValidation;
