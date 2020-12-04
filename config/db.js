const Sequelize = require('sequelize')

const { basename, username, password, host } = require("./config.json")

const sequelize = new Sequelize(basename, username, password, {
  host: host,
  dialect: 'mysql',
  pool: {
      max: 5,
      min: 0,
      idle: 30000
  }
})

module.exports = sequelize