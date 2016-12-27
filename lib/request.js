/**
 * @author synder on 2016/12/21
 * @copyright
 * @desc
 */

const url = require('url');
const crypto = require('./crypto');
const moment = require('moment');

class AliPayRequest {
    
    /**
     * @desc 使用rsa对请求进行签名
     * */
    static rsaEncryptRequest(appPrivateKey, form){
        if(typeof form !== 'object'){
            throw new Error('form must be a object');
        }

        if(!appPrivateKey){
            throw new Error('private key should not be null');
        }
        
        let temp = [];

        for(let key in form){
            if(form.hasOwnProperty(key) && key != 'sign'){
                temp.push(key + '=' + form[key]);
            }
        }
        
        temp = temp.sort();
        
        let str = temp.join('&');
        
        return crypto.rsaSign(appPrivateKey, str);
        
    }
    
    /**
     * @desc 同步返回结果验证签名
     * */
    static rsaVerifyResponse(aliPublicKey, signature, body){

        if(typeof body !== 'object'){
            throw new Error('form must be a object');
        }

        if(!aliPublicKey){
            throw new Error('aliPublicKey key should not be null');
        }
        
        if(!signature){
            return false;
        }
        
        let str = JSON.stringify(body);

        return crypto.rsaVerify(aliPublicKey, signature, str);
    }
    
    /**
     * @desc 生活号异步通知需要使用这个方法验签名
     * */
    static rsaVerifyNotify(aliPublicKey, query){
        if(typeof query !== 'object'){
            throw new Error('form must be a object');
        }

        if(!aliPublicKey){
            throw new Error('aliPublicKey key should not be null');
        }
        
        let temp = [];
        
        if(!query.sign){
            return false;
        }

        for(let key in query){
            if(query.hasOwnProperty(key) && key != 'sign' && key != 'sign_type' && query[key] != ''){
                temp.push(key + '=' + decodeURI(query[key]));
            }
        }
        
        temp = temp.sort();
        
        let str = temp.join('&');

        return crypto.rsaVerify(aliPublicKey, signature, str);
    }
    
    constructor() {
        this.__appId = null;
        this.__appPrivateKey = null;
        this.__appPublicKey = null;
        this.__appAesKey = null;
        this.__aliPublicKey = null;
        this.__gateway = null;
        this.__method = 'GET';
        this.__form = {};
    }
    
    _setAppId(appId){
        this.__appId = appId;
    }
    
    _setAppPrivateKey(key){
        this.__appPrivateKey = key;
    }
    
    _setAppPublicKey(key){
        this.__appPublicKey = key;
    }
    
    _setAppAesKey(key){
        this.__appAesKey = key;
    }
    
    _setAliPublicKey(key){
        this.__aliPublicKey = key;
    }
    
    _setGateway(gateway){
        this.__gateway = gateway;
    }

    _getRequestMethod(){
        return this.__method.toLocaleUpperCase();
    }

    _getRequestForm(){
        this.__form.app_id = this.__appId;
        this.__form.timestamp = moment().format('YYYY-MM-DD hh:mm:ss');
        for(let key in this.__form){
            if(this.__form.hasOwnProperty(key)){
                if(this.__form[key] == null){
                    delete this.__form[key];
                }
            }
        }
        return this.__form;
    }

    _getRequestUrl() {
        let gateway = this.__gateway;
        let form = this._getRequestForm();
        form.sign = AliPayRequest.rsaEncryptRequest(this.__appPrivateKey, form);

        return url.format({
            protocol: gateway.protocol,
            hostname: gateway.host,
            port: gateway.port,
            pathname: gateway.pathname,
            query: form
        });
    }
    
    _checkResponse(body){
        
        if(!body){
            return {
                error: new Error('body is empty'),
                response: null
            };
        }
        
        let response;
        let signature = body.sign;
        
        for(let key in body){
            if(body.hasOwnProperty(key) && key.indexOf('_response') > 0){
                response = body[key];
                break;
            }
        }
        
        if(!response){
            return {
                error: new Error('response is empty'),
                response: null
            };
        }

        if(signature && !AliPayRequest.rsaVerifyResponse(this.__aliPublicKey, signature, response)){
            return {
                error: 'response sign verify failed',
                response: response
            };
        }
        
        if(response.code && response.code != 10000){
            return {
                error: new Error(response.sub_msg),
                response: response
            };
        }
        
        return {
            error: null,
            response: response
        };
    }
}

module.exports = AliPayRequest;