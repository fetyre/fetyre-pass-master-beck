import * as Joi from 'joi';

export const validationSchema = Joi.object({
	// APP_ID: Joi.string().required(),
	EMAIL_HOST: Joi.string().required(),
	EMAIL_PORT: Joi.number().required(),
	EMAIL_SECURE: Joi.bool().required(),
	EMAIL_USER: Joi.string().email().required(),
	EMAIL_PASSWORD: Joi.string().required(),
	EMAIL_FROM: Joi.string().required(),
	SUPPORT_EMAIL: Joi.string().required()
});
