const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = require('../config/db')

var SERVICE_LIST = sequelize.define('SERVICE_LIST', {
  name: DataTypes.STRING(255), // 服务名称
  imgSrc: DataTypes.STRING(255), // 图片地址
  description: DataTypes.STRING(255), // 服务描述
  mainBody: DataTypes.TEXT(), // 正文内容
  viewCount: DataTypes.NUMBER(255), // 浏览量
  isDelete: DataTypes.NUMBER(1),
  createdBy: DataTypes.STRING(255)
}, {
  tableName: 'service_list'
})

module.exports = {
  SERVICE_LIST
}