const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: 'LTAI4G6hMj4n5WgJuujyg1LY',
  accessKeySecret: 'Xz37g0jLZryNVNAFDM3hui5TWd3btE',
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
