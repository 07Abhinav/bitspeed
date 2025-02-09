const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // SQLite file
  logging: false,
});

sequelize.sync({ alter: true }) // Ensures the table structure updates
  .then(() => console.log("SQLite Database synced"))
  .catch(err => console.error("Database sync error:", err));

module.exports = sequelize;
