import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express'
import routes from './routes/index.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notfound.js';
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dbConnect from './config/db.js';
import UserModel from './models/UserModel.js';
dotenv.config();

// const __filename = fileURLToPath(import.meta.url)
// const __directory = path.dirname(__filename)
const app = express()
const {PORT} = process.env || 3000

app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'dev',
    saveUninitialized:true,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },

}))
dbConnect();
UserModel()
app.use(logger);
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)


app.listen (PORT,()=>{
console.log(`server at port ${PORT}`)
})