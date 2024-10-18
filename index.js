const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')


const userRouter = require('./routes/user.routes.js')
const favouriteRouter = require('./routes/favourite.routes.js')
const sertificateRouter = require('./routes/sertificate.routes.js')
const newsRouter = require('./routes/news.routes.js')
const authRouter = require('./routes/auth.routes.js')
const baseRouter = require('./routes/base.routes.js')
const goodsRouter = require('./routes/goods.routes.js')



const PORT =  5000;

const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))

const corsOptions ={
    origin:[
        'http://localhost:3000',
        'http://localhost:5173',
    ], 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
app.use(cors(corsOptions))

app.use(express.json())
app.use('/api', userRouter)
app.use('/api', favouriteRouter)
app.use('/api', sertificateRouter)
app.use('/api', newsRouter)
app.use('/api/auth', authRouter)
app.use('/api', baseRouter)
app.use('/api', goodsRouter)
app.listen(PORT, () => console.log(PORT))

