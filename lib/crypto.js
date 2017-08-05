/**
 * @author synder on 2016/12/23
 * @copyright
 * @desc
 */

const crypto = require('crypto');
console.log(crypto.getHashes())
exports.rsaSign = function(privateKey, string) {
    let sign = crypto.createSign('sha1WithRSAEncryption');
    sign.write(string);
    sign.end();
    return sign.sign(privateKey, 'base64');
};

exports.rsaVerify = function(publicKey, signature, string) {
    let verify = crypto.createVerify('sha1WithRSAEncryption');
    verify.write(string);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};
exports.rsa2Sign = function(privateKey, string) {
    let sign = crypto.createSign('sha256WithRSAEncryption');
    sign.write(string);
    sign.end();
    return sign.sign(privateKey, 'base64');
};

exports.rsa2Verify = function(publicKey, signature, string) {
    let verify = crypto.createVerify('sha256WithRSAEncryption');
    verify.write(string);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
};