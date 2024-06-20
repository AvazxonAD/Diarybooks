const express = require('express')
const app = express()
const errorHandler = require('./middleware/errorHandler')
const path = require('path')

require('dotenv').config()
require('colors')


app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))

app.use('/auth', require('./router/auth.router'))
app.use('/diarybook', require('./router/diarybook.router.js'))
app.use('/commit', require('./router/commit.router.js'))

app.use(errorHandler)

const  PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server runing on port : ${PORT}`.blue)
})

