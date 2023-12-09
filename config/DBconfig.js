require('dotenv').config();
const env = process.env;

const development = {
    username: "plan_puzzle",
    password: "1234",
    database: "plan_puzzle",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+09:00"
}

const test = {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "+09:00"
}

const production = {
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    host: env.DB_HOST,
    dialect: "mysql",
    timezone: "+09:00"
}

module.exports = {development, test, production};