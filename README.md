##0、注意事项
- AliPayClient和AliPayRequest内部封装了请求签名和返回验证签名方法，会自动位请求带上签名，并且验证返回的签名

##1、创建请求客户端
```javascript
const fs = require('fs');
const alipay = require('olipay');
const debug = true;

const client = new alipay.AliPayClient({
    appId: '2016090900473171',
    appPrivateKey: fs.readFileSync('app private key pem path'),
    appPublicKey: fs.readFileSync('app public key pem path'),
    aliPayPublicKey: fs.readFileSync('alipay public key path'),
    appAESKey: 'app aes key',
}, debug);
```

##2、创建请求
```javascript
 let accessTokenRequest = new alipay.auth.AccessTokenRequest();
    
 accessTokenRequest.setBizContent({
        grant_type: 'authorization_code',
        code: 'auth_code_***'
 });
```

##3、发送请求或者执行跳转
```javascript
const fs = require('fs');
const alipay = require('olipay');
const debug = true;

const client = new alipay.AliPayClient({
    appId: '2016090900473171',
    appPrivateKey: fs.readFileSync('app private key pem path'),
    appPublicKey: fs.readFileSync('app public key pem path'),
    aliPayPublicKey: fs.readFileSync('alipay public key path'),
    appAESKey: 'app aes key',
}, debug);

let webLogin = function() {
  let accessTokenRequest = new alipay.auth.AccessTokenRequest();
      
  accessTokenRequest.setBizContent({
          grant_type: 'authorization_code',
          code: 'auth_code_***'
  });
  
  client.request(accessTokenRequest, function (err, body) {
      if(err){
          return next(err);
      }
      
      let userInfoRequest = new alipay.auth.UserInfoRequest();
      
      userInfoRequest.setAccessToken(body.access_token);
      
      client.request(userInfoRequest, function (err, body) {
          if(err){
              return next(err);
          }
          
          console.log(body);
      });
  });
};

```