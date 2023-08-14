const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})



//hash the password before saving
userSchema.pre('save', async function (next) {
	try {
		const passwordHash = await bcrypt.hash(this.password, 10)
		this.password = passwordHash
		next()
	} catch (error) {
		next(error)
	}
})

//compare password to login users
userSchema.methods.isValidPassword = async function(password) {
	try {
		return await bcrypt.compare(password, this.password)
	} catch (error) {
		throw error
	}
}




const User = mongoose.model('User', userSchema)
module.exports = User 