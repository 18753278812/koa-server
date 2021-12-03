const { DataTypes } = require('sequelize')

const sequelize = require('../config/db')

var USER = sequelize.define('USER', {
  username: DataTypes.STRING(255),
  password: DataTypes.STRING(255)
}, {
  tableName: 'user'
})

module.exports = {
  USER
}