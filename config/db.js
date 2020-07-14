const Sequelize = require('sequelize')
const config = require('config')

const { basename, username, password, host } = config.get('mysql')

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