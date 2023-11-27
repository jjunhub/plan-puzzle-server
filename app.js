const express = require('express');
const app = express();
const {sequelize} = require('./models');
const routes = require('./routes');
const {errorHandler} = require("./middlewares/errorHandler");
const session = require('express-session');
const sessionConfig = require('./config/sessionConfig');
const dotenv = require('dotenv');
const cors = require('cors');
const corsConfig = require('./config/corsConfig');
const morgan = require('morgan');

dotenv.config();
app.use(cors(corsConfig));
app.use(session(sessionConfig));
app.use(morgan('dev'));

sequelize.sync({force:false})
.then(()=>{
    console.log('데이터 베이스 연결에 성공하였습니다.');
}).catch((error)=>{
    console.log(error);
});

app.use(express.json());
app.use('/api',routes);

app.use(errorHandler);

app.listen(3080, function(){
    console.log('Express server is listening');
});

