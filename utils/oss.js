let OSS = require('ali-oss');
const fs = require('fs')
const { accessKeyId, accessKeySecret } = require('../config/config.json')


let client = new OSS({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: 'oss-cn-beijing',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId,
  accessKeySecret,
  internal: false
});

client.useBucket('oss-test-003');
async function list () {
  try {
    let result = await client.list({
      'max-keys': 5
    })
    console.log(result)


  } catch (err) {
    console.log (err)
  }
}

async function put (fileName, path) {
  try {
    let result = await client.put(fileName, path);
    fs.unlinkSync(path);
    return result

   } catch (err) {
     console.log (err);
   }
}

async function get () {
  try {
    let result = await client.get('exampleobject.txt', 'D:\\localpath\\examplefile.txt');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  get,
  put,
  list
}