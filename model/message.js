const { DataTypes } = require('sequelize')

const sequelize = require('../config/db')

var MESSAGE = sequelize.define('MESSAGE', {
  phone: DataTypes.STRING(11),
  remote_addr: DataTypes.STRING(255),
  code: DataTypes.STRING(6),
  status: DataTypes.NUMBER(1)
}, {
  tableName: 'message_code'
})

module.exports = {
  MESSAGE
}
