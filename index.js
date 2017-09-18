/**
 * @author synder on 2016/12/21
 * @copyright
 * @desc
 */

const url = require('url');
const crypto = require('crypto');
const request = require('request');

const trade = require('./module/trade');
const oauth = require('./module/oauth');

const AliPayRequest = require('./lib/request');

class AliPayClient {

    gateway() {
        if (this.develop === true) {
            return {
                protocol: 'https',
                host: 'openapi.alipaydev.com',
                port: 443,
                pathname: 'gateway.do',
            }
        } else {
            return {
                protocol: 'https',
                host: 'openapi.alipay.com',
                port: 443,
                pathname: 'gateway.do',
            }
        }
    };

    constructor(options, develop = false) {
        this.develop = develop;
        this.appId = options.appId;
        this.appPrivateKey = options.appPrivateKey;
        this.appPublicKey = options.appPublicKey;
        this.appAESKey = options.appAESKey;
        this.aliPayPublicKey = options.aliPayPublicKey;

        if (!this.appId) {
            throw new Error('appId should not be null');
        }

        if (!this.appPrivateKey) {
            throw new Error('appPrivateKey should not be null');
        }

        if (!this.appPublicKey) {
            throw new Error('appPublicKey should not be null');
        }

        if (!this.appAESKey) {
            throw new Error('appAESKey should not be null');
        }

        if (!this.aliPayPublicKey) {
            throw new Error('aliPayPublicKey should not be null');
        }
    }

    //返回重定向请求URL
    redirect(aliPayRequest) {
        if (!(aliPayRequest instanceof AliPayRequest)) {
            throw new Error('request should be a instance of AliPayRequest')
        }

        aliPayRequest._setGateway(this.gateway());
        aliPayRequest._setAppId(this.appId);
        aliPayRequest._setAppPrivateKey(this.appPrivateKey);
        aliPayRequest._setAppPublicKey(this.appPublicKey);
        aliPayRequest._setAppAesKey(this.appAESKey);
        aliPayRequest._setAliPublicKey(this.aliPayPublicKey);

        return aliPayRequest._getRequestUrl()
    }

    //发送请求
    request(aliPayRequest, callback) {

        if (!(aliPayRequest instanceof AliPayRequest)) {
            throw new Error('request should be a instance of AliPayRequest')
        }

        aliPayRequest._setGateway(this.gateway());
        aliPayRequest._setAppId(this.appId);
        aliPayRequest._setAppPrivateKey(this.appPrivateKey);
        aliPayRequest._setAppPublicKey(this.appPublicKey);
        aliPayRequest._setAppAesKey(this.appAESKey);
        aliPayRequest._setAliPublicKey(this.aliPayPublicKey);

        const options = {
            method: aliPayRequest._getRequestMethod(),
            url: aliPayRequest._getRequestUrl(),
            json: true
        };

        console.log('alipay--request------');
        console.log(options);
        if (arguments.length === 1) {
            return new Promise(function(resolve, reject) {
                request(options, function(err, response, body) {
                    // console.log(response, body)
                    if (err) {
                        return reject(err);
                    }

                    let results = aliPayRequest._checkResponse(body);

                    callback(results.error, results.response);
                });
            });
        }

        if (typeof callback === 'function') {
            return request(options, function(err, response, body) {
                // console.log(response, body)
                if (err) {
                    return callback(err);
                }

                let results = aliPayRequest._checkResponse(body);
                // console.log(results);
                callback(null, results.response, body);
            });
        }

        return request(options);
    }
}

exports.AliPayClient = AliPayClient;

exports.auth = {
    WebLoginRequest: oauth.WebLoginRequest,
    AccessTokenRequest: oauth.AccessTokenRequest,
    UserInfoRequest: oauth.UserInfoRequest,
};

exports.trade = {
    WapPayRequest: trade.WapPayRequest,
    PayQueryRequest: trade.PayQueryRequest,
    PayCloseRequest: trade.PayCloseRequest,
    PayRefundRequest: trade.PayRefundRequest,
    RefundQueryRequest: trade.RefundQueryRequest,
};