import express from 'express'
import routerLocation from './locationRouter.js'

const routes = express()



routes.use('/api-v1', routerLocation)


export default routes