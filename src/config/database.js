require("dotenv").config();
const { Sequelize } = require("sequelize");

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  throw new Error("DATABASE_URL is not defined. Check your .env file.");
}

const sequelize = new Sequelize(DB_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Allow self-signed certs
    },
  },
  logging: false,
});

module.exports = sequelize;
