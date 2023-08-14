const router = require('express').Router()
const createError = require('http-errors')
const User = require('../models/user-model')
const {authSchema} = require('../middleware/schema-validate')
const {generateAccessToken} = require('../authentication/jwt-auth')
const {verifyAccessToken} = require('../authentication/jwt-auth')
const {generateRefreshToken} = require('../authentication/jwt-auth')
const {verifyRefreshToken} = require('../authentication/jwt-auth')
const bcrypt = require('bcrypt')

//get route (protected)
router.get('/protected', verifyAccessToken, (req, res) => {
	res.json({
		message: 'Hello Auth100'
	})
})


//register user
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

		//create user
		const user = new User({
			email: result.email,
			password: result.password
		})

		const savedUser = await user.save()
		
		const accessToken = await generateAccessToken(savedUser.id)
		const refreshToken = await generateRefreshToken(savedUser.id)
		// when a user registers, send an access token and a refresh token

		res.status(201).json({accessToken, refreshToken})
	} catch (error) {
		if (error.isJoi) {
			error.status = 400
		}
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	try {
		//validate request body using joi validation schema
		const result = await authSchema.validateAsync(req.body)

		//check if the user with given email exists
		const user = await User.findOne({ email: result.email })

		if(!user) {
			throw createError.NotFound('User not registered')
		}

		//compare given password with hashed password in database
		const passwordMatch = await user.isValidPassword(result.password)  //isValidPassword from bcrypt.compare() in user schema
		if(!passwordMatch) {
			throw createError.Unauthorized('email or password is incorrect')
		} 
		//if the user's login credentials are correct, generate a new access & refresh token for him and log him in
		const accessToken = await generateAccessToken(user.id)
		const refreshToken = await generateRefreshToken(user.id)

		res.json({accessToken, refreshToken})
	} catch (error) {
		if (error.isJoi) {
			error.status = 400
		}
		next(error)
	}
})

router.post('/refresh-token', async (req, res, next) => {
	try {
		const {tokenBody} = req.body

		// if theres no refresh token in the request body, throw an error
		//if there is, veerify the refresh token first 
		if(!tokenBody) {
			throw createError.BadRequest()
		}
		//the userId here is what we resolved in the verifyRefreshToken function
		const userId = await verifyRefreshToken(tokenBody)

		const accessToken = await generateAccessToken(userId)
		const refreshToken = await generateRefreshToken(userId)

		res.json({ accessToken, refreshToken })

	} catch (error) {
		next(error)
	}
})

router.delete('/logout', async (req, res, next) => {
	res.send('logout route')
})

module.exports = router