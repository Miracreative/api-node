const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')


const userRouter = require('./routes/user.routes.js')
const postRouter = require('./routes/post.routes.js')
const sertificateRouter = require('./routes/sertificate.routes.js')
const newsRouter = require('./routes/news.routes.js')
const authRouter = require('./routes/auth.routes.js')
const baseRouter = require('./routes/base.routes.js')



const PORT =  5000;

const app = express()

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))
app.use(cors())

app.use(express.json())
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', sertificateRouter)
app.use('/api', newsRouter)
app.use('/api/auth', authRouter)
app.use('/api', baseRouter)
app.listen(PORT, () => console.log(PORT))

