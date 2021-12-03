/**
 * 已废弃 
 * 2021.12.03
 */

const mongoose = require('mongoose')

const { mongoDB } = require('./config.json')

const DB_URL = mongoDB

mongoose.set('useCreateIndex', true)
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
 
mongoose.connection.on('connected',function() {
   console.log('数据库已连接');
});
/**
* 连接异常 error 数据库连接错误
*/
mongoose.connection.on('error',function(err) {
  console.log('数据库连接错误: '+ err);
});
/**
* 连接断开 disconnected 连接异常断开
*/
mongoose.connection.on('disconnected',function() {
  console.log('数据库已断开');
})

module.exports = mongoose