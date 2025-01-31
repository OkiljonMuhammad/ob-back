const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: "mysql",
});

module.exports = sequelize;