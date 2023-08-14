const jwt  = require('jsonwebtoken')
const createError = require('http-errors')


module.exports = {
	//generate token function
	generateAccessToken(userId) {
		return new Promise((resolve, reject) => {
			const payload = {}
			const secret = process.env.ACCESS_TOKEN_SECRET
			const options = {
				expiresIn: '1m',
				issuer: 'Auth100.org',	//my website
				audience: userId,		//who the token is intended for
			}
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message)
					// the error should not be sent to the client, it's an internal server error gotten when generating the token, so send a 500 to the client bt log the error.
					reject(createError.InternalServerError())
				} else {
					resolve(token)
				}
			})
		})
	},

	// verify access token function
	verifyAccessToken (req, res, next) {
		// check if there's authorization in the header
		if (!req.headers['authorization']) {		
			return next(createError.Unauthorized())
		}
		//continue if there's authorization
		//get the authorization header value
		const authHeader = req.headers['authorization']
		//split the authHeader since it's an array, get the bearerToken alone.
		const token = authHeader.split(' ')[1]
		// verify the bearerToken with jwt
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if(err) {
				if (err.name === 'JsonWebTokenError') {
					return next(createError.Unauthorized())
				} else {
					return next(createError.Unauthorized(err.message))
				}
			}
			req.payload = payload
			next()
		})
	},

	//generate refresh token
	generateRefreshToken(userId) {
		return new Promise((resolve, reject) => {
			const payload = {}
			const secret = process.env.REFRESH_TOKEN_SECRET
			const options = {
				expiresIn: '1y',
				issuer: 'Auth100.org',
				audience: userId,
			}

			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.log(err.message)

					reject(createError.InternalServerError())
				} else {
					resolve(token)
				}
			})
		})
	},

	// verify refresh token
	verifyRefreshToken(refreshToken) {
		return new Promise((resolve, reject) => {
			jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
				if (err) {
					return reject(createError.Unauthorized())
				}
				// the payload audience is the user's id, so that's what we resolve in the function
				const userId = payload.aud
				resolve(userId)
			})
		})
	}
}