const mongoose = require('../config/mongodb');
const Schema = mongoose.Schema;
 
// const UserSchema = new Schema({
//   id: Number,
//   username: String
// }, {
//   timestamps: {

//   }
// })

// 设置索引过期时间
// UserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

const UserSchema = new Schema({
  id: Number,
  username: String,
  createdAt: { type: Date, default: new Date().toUTCString(), expires: 3600 }
})
 
const MyModel = mongoose.model('user', UserSchema);
 
 
class Mongodb {
  constructor () {
 
  }
// 查询
  query (data) {
     return new Promise((resolve, reject) => {
       MyModel.find(data, (err, res) => {
         if(err) {
           reject(err)
         }
         resolve(res)
       })
     })
  }
// 保存
  save (obj) {
     const m = new MyModel(obj)
     return new Promise((resolve, reject)=> {
       m.save((err, res) => {
         if (err) {
           reject(err)
         }
         console.log(res)
         resolve(res)
       })
     })
     
  }
}
module.exports = new Mongodb()
