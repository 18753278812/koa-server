const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = require('../config/db')

var SERVICE_LIST = sequelize.define('SERVICE_LIST', {
  name: DataTypes.STRING(255), // 服务名称
  entry: DataTypes.STRING(255), // 服务地址
  description: DataTypes.STRING(255), // 服务描述
  activeRule: DataTypes.STRING(255), // 服务入口
  container: DataTypes.STRING(255), // 服务节点
  isDelete: DataTypes.NUMBER(1),
  createdBy: DataTypes.STRING(255)
}, {
  tableName: 'service_list'
})

module.exports = {
  SERVICE_LIST
}