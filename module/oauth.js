/**
 * @author synder on 2016/12/21
 * @copyright
 * @desc
 */


const AliPayRequest = require('../lib/request');

class AuthRequest extends AliPayRequest {

    static interfaces (){
        return {
            auth: {
                login: {
                    method: 'GET',
                    name: 'alipay.user.info.auth',
                    summary: '用户登录授权',
                    desc: '用户登录授权'
                },
                token: {
                    method: 'GET',
                    name: 'alipay.system.oauth.token',
                    summary: '换取授权访问令牌',
                    desc: '换取授权访问令牌'
                },
            },
            user: {
                info: {
                    method: 'GET',
                    name: 'alipay.user.info.share',
                    summary: '支付宝会员授权信息查询接口',
                    desc: '支付宝会员授权信息查询接口'
                }
            },
        }
    };

    constructor() {
        super();

        this.__method = '';
        this.__form = {
            format: 'JSON',
            charset: 'utf-8',
            sign_type: 'RSA',
            version: '1.0',
            method: null,
            biz_content: null,
        };
    }

    setAppAuthToken(token){
        this.__form.app_auth_token = token;
        return this;
    }

    setBizContent(obj){
        this.__form.biz_content = JSON.stringify(obj);
        return this;
    }
}


//用户登录授权
class WebLoginRequest extends AuthRequest {

    constructor(){
        super();

        let interfaces = AuthRequest.interfaces();

        this.__method = interfaces.auth.login.method;
        this.__form.method = interfaces.auth.login.name;
    }

    setReturnUrl(url){
        this.__form.return_url = url;
        return this;
    }
}

exports.WebLoginRequest = WebLoginRequest;



//获取AccessToken
class AccessTokenRequest extends AuthRequest {
    constructor(){
        super();

        let interfaces = AuthRequest.interfaces();

        this.__method = interfaces.auth.token.method;
        this.__form.method = interfaces.auth.token.name;
    }

    setBizContent(obj){
        this.__form.grant_type = obj.grant_type;
        this.__form.refresh_token = obj.refresh_token;
        this.__form.code = obj.code;
        return this;
    }
}

exports.AccessTokenRequest = AccessTokenRequest;



//获取用户信息
class UserInfoRequest extends AuthRequest {
    constructor(){
        super();

        let interfaces = AuthRequest.interfaces();

        this.__method = interfaces.user.info.method;
        this.__form.method = interfaces.user.info.name;
    }

    setBizContent(obj){
        this.__form.biz_content = JSON.stringify(obj);
        return this;
    }
    
    setAccessToken(token){
        this.__form.auth_token = token;
        return this;
    }
}

exports.UserInfoRequest = UserInfoRequest;