import Joi from "joi";

export const schemas = {
  signUp: Joi.object({
    pseudo: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.valid(Joi.ref("password")).required().messages({
      "any.only": "La confirmation du mot de passe ne correspond pas",
    }),
  }),

  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  addFavorite: Joi.object({
    recipe_id: Joi.string().required(),
    recipe_name: Joi.string().required(),
    recipe_thumb: Joi.string().uri().allow("", null).optional(),
  }),
};
