const mongoose = require('mongoose')
require('dotenv').config()

async function connectToDatabase() {
	try {

		await mongoose.connect( process.env.DATABASE_URI, { useUnifiedTopology: true, useNewUrlParser: true })

		console.log('connected to database')
	} catch (error) {
		console.log(error.message)
	}
}

connectToDatabase()