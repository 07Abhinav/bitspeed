const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define("Contact", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  phoneNumber: { type: DataTypes.STRING, allowNull: true, unique: false },
  email: { type: DataTypes.STRING, allowNull: true, unique: false },
  linkedId: { type: DataTypes.INTEGER, allowNull: true },
  linkPrecedence: { 
    type: DataTypes.ENUM("primary", "secondary"), 
    allowNull: false 
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  deletedAt: { type: DataTypes.DATE, allowNull: true },
});

module.exports = Contact;
