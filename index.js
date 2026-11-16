const dotenv = require('dotenv');
dotenv.config();
const { db } = require('./models');
const express = require('express');
const cors = require('cors');
const seedAdmin = require('./config/seed');
const authRouter = require('./auth/router');
const userRouter = require('./user/router');
const categoryRouter = require('./category/router');
const authorRouter = require('./author/router');
const bookRouter = require('./book/router');
const readerRouter = require('./reader/router');
const loanRouter = require('./loan/router');
const reportRouter = require('./report/router');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());


app.use('/v1/auth', authRouter);
app.use('/v1/user', userRouter);
app.use('/v1/categories', categoryRouter);
app.use('/v1/authors', authorRouter);
app.use('/v1/books', bookRouter);
app.use('/v1/readers', readerRouter);
app.use('/v1/loans', loanRouter);
app.use('/v1/reports', reportRouter);

db.sync().then(seedAdmin).then(() => {
    app.listen(PORT, () => {
        console.log(`SERVIDOR RODANDO http://localhost:${PORT}`);
    });
});
