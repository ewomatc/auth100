require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const PORT = process.env.PORT
const errorHandler = require('./middleware/error-handler')
const authRouter = require('./routes/auth-route')
require('./database/init-db')

const app = express()

app.use(morgan('dev'))
app.use(express.json())


// load all routes/ endpoints
app.use('/auth', authRouter)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'hello auth100'
  })
})


//404 error handler
app.use( async(req, res, next) => {
  next(createError.NotFound())
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
})