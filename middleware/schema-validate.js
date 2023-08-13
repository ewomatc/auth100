const Joi = require('joi')

const authSchema = Joi.object({
	email: Joi.string().trim().email().lowercase().required(),
	password: Joi.string().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({ 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one digit' })
})

module.exports = {
	authSchema
}