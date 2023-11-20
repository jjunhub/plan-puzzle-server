const express = require('express');
const app = express();
const {sequelize} = require('./models');
const routes = require('./routes');
const {errorHandler} = require("./middlewares/errorHandler");
const session = require('express-session');
const sessionConfig = require('./config/sessionConfig');
const dotenv = require('dotenv');

dotenv.config();
app.use(session(sessionConfig));

sequelize.sync({force:false})
.then(()=>{
    console.log('데이터 베이스 연결에 성공하였습니다.');
}).catch((error)=>{
    console.log(error);
});

app.use(express.json());
app.use('/',routes);

app.use(errorHandler);

app.listen(3000, function(){
    console.log('Express server is listening');
});

