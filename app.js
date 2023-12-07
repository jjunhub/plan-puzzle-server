
const express = require('express');

const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const sessionConfig = require('./config/sessionConfig');
const corsConfig = require('./config/corsConfig');
const {sequelize} = require('./models');
const {errorHandler} = require("./middlewares/errorHandler");
const routes = require('./routes');
const app = express();


app.use(cors(corsConfig));
app.use(session(sessionConfig));
app.use(morgan('dev'));

sequelize.sync({force: false})
    .then(() => {
        console.log('데이터 베이스 연결에 성공하였습니다.');
    }).catch((error) => {
    console.log(error);
    process.exit();
});

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.listen(process.env.PORT, function () {
    console.log('Express server is listening at ' + process.env.PORT);
    console.log(process.env.NODE_ENV);
});

