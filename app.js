
import express from 'express'
import bodyParser from 'body-parser'
import routes from './src/routes/indexRouter.js'
import 'dotenv/config.js'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000






app.use(routes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
