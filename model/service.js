const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = require('../config/db')

var SERVICE_LIST = sequelize.define('SERVICE_LIST', {
  name: DataTypes.STRING(255),
  imgSrc: DataTypes.STRING(255),
  isDelete: DataTypes.NUMBER(1),
  createdBy: DataTypes.STRING(255),
  description: DataTypes.TEXT(255),
  viewCount: DataTypes.NUMBER(255)
}, {
  tableName: 'service_list'
})

module.exports = {
  SERVICE_LIST
}