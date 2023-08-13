const jwt  = require('jsonwebtoken')
const createError = require('http-errors')


module.exports = {
	//generate token function
	generateToken(userId) {
		return new Promise((resolve, reject) => {
			const payload = {
				name: 'some name'
			}
			const secret = process.env.ACCESS_TOKEN_SECRET
			const options = {
				expiresIn: '1h',
				issuer: 'Auth100.org',	//my website
				audience: userId,		//who the token is intended for
			}
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					reject(err)
				} else {
					resolve(token)
				}
			})
		})
	}
}