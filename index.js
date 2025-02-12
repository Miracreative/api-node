// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const cookies = require("cookie-parser");

const userRouter = require('./routes/user.routes.js');
const favouriteRouter = require('./routes/favourite.routes.js');
const sertificateRouter = require('./routes/sertificate.routes.js');
const newsRouter = require('./routes/news.routes.js');
const authRouter = require('./routes/auth.routes.js');
const baseRouter = require('./routes/base.routes.js');
const goodsRouter = require('./routes/goods.routes.js');
const soutRouter = require('./routes/sout.routes.js');
const personsRouter = require('./routes/persons.routes.js');
const companyRouter = require('./routes/company.routes.js');
const afoamRouter = require('./routes/afoam.routes.js');
const formSubmitRouter = require('./routes/formSubmit.routes.js');

const PORT = 5000;

const app = express();

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));

const corsOptions = {
	origin: [
		'https://front-next.atman-auto.ru',
		'https://admin-panel.atman-auto.ru',
		'http://localhost:3000',
		'http://localhost:5173',
		'https://atman-auto.vercel.app'
	],
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  	allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));

app.use(express.static('uploads'));
app.use(cookies());

app.use(express.json());
app.use('/api', userRouter);
app.use('/api', favouriteRouter);
app.use('/api', sertificateRouter);
app.use('/api', newsRouter);
app.use('/api/auth', authRouter);
app.use('/api', baseRouter);
app.use('/api', goodsRouter);
app.use('/api', soutRouter);
app.use('/api', personsRouter);
app.use('/api', companyRouter);
app.use('/api', afoamRouter);

app.use('/api', formSubmitRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
