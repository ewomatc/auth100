const router = require('express').Router()
const createError = require('http-errors')
const User = require('../models/user-model')
const {authSchema} = require('../middleware/schema-validate')
const {generateToken} = require('../authentication/jwt-auth')
const bcrypt = require('bcrypt')

//login user
router.post('/register', async (req, res, next) => {
	try {
		const { email, password } = req.body

		//validate request body
		const result = await authSchema.validateAsync(req.body)
		//check for existing user
		const userExists = await User.findOne({ email: result.email })
		if (userExists) {
			throw createError.Conflict(`${result.email} has been registered`)
		}

		//hash the password before creating user
		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(result.password, salt)

		//create user
		const user = new User({
			email: result.email,
			password: passwordHash
		})

		const savedUser = await user.save()
		
		const accessToken = await generateToken(savedUser.id)

		res.status(201).json({accessToken})
	} catch (error) {
		if (error.isJoi) {
			error.status = 400
		}
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	res.send('login route')
})

router.post('/refresh-token', async (req, res, next) => {
	res.send('refresh token route')
})

router.delete('/logout', async (req, res, next) => {
	res.send('logout route')
})

module.exports = router