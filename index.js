const express = require('express');
const fileUpload = require('express-fileupload');
const userRouter = require('./routes/user.routes.js')
const postRouter = require('./routes/post.routes.js')
const PORT =  5000;

const app = express()


app.use(fileUpload({}))
app.use('/api', userRouter)
app.use('/api', postRouter)
app.listen(PORT, () => console.log(PORT))

