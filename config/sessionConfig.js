const expressSession = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);
const db = require('../models/index');

const sessionStore = new SequelizeStore({
    db: db.sequelize,
});

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
};

module.exports = sessionConfig;