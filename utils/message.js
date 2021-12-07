const Core = require('@alicloud/pop-core');
const { accessKeyId, accessKeySecret } = require('../config/config.json')

var client = new Core({
  accessKeyId,
  accessKeySecret,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

var params = {
  // "PhoneNumbers": "18753278812",
  "SignName": "个人技术Git文件存储学",
  "TemplateCode": "SMS_211491616",
  // "TemplateParam": "{ \"code\": \"666666\"}"
}

var requestOption = {
  method: 'POST'
};

module.exports = {
  sendSms
}

function sendSms(phone, code) {
  return new Promise((reslove, reject) => {
    client.request('SendSms', Object.assign({} ,params, {
      PhoneNumbers: phone,
      TemplateParam: `{ \"code\": ${code}}`
    }), requestOption).then((result) => {
      console.log(JSON.stringify(result))
      reslove(result)
    }, (ex) => {
      console.log(ex)
      reject(ex)
    })
  })
  
}
