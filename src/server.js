import { ENVIRONMENT } from './common/config/environment.js'
import express from 'express'
import AppError from './common/utils/appError.js'
import {
    catchAsync,
    handleError,
    timeoutMiddleware,
} from './common/utils/errorHandler.js'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { stream } from './common/utils/logger.js'
import morgan from 'morgan'
import { connectDb } from './common/config/database.js'
import { api } from './api.js'

const app = express()
const port = ENVIRONMENT.APP.PORT
const appName = ENVIRONMENT.APP.NAME

/**
 * App Security
 */
app.use(helmet())
app.use(
    cors({
        origin: [
            'http://localhost:3001',
            'http://localhost:5173',
            'https://studyiq-frontend.vercel.app',
        ],
        credentials: true,
    })
)


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.disable('x-powered-by')
app.use(compression())

/**
 * Logger Middleware
 */
app.use(
    morgan(ENVIRONMENT.APP.ENV !== 'local' ? 'combined' : 'dev', { stream })
)

// append request time to all request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

/**
 * Initialize routes
 */
app.use('/api/v1', api)

// catch 404 and forward to error handler
app.all(
    '*',
    catchAsync(async () => {
        throw new AppError('route not found', 404)
    })
)

/**
 * Error handler middlewares
 */
app.use(timeoutMiddleware)
app.use(handleError)

/**
 * status check
 */
app.get('*', (req, res) =>
    res.send({
        Time: new Date(),
        status: 'running',
    })
)

/**
 * Bootstrap server
 */
app.listen(port, () => {
    console.log('=> ' + appName + ' app listening on port ' + port + ' !')
    connectDb()
})
