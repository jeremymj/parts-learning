const ethUtils = require('ethereumjs-util')
const {randomBytes} = require('crypto')

const cookie = uuid()
const aesjs = require('aes-js');

function generate_keys_pair () {
  let keypair = {privateKey: null, publicKey: null}
  let privKey
  do {
    privKey = randomBytes(32)
  } while (!ethUtils.secp256k1.privateKeyVerify(privKey))

  let public_key = ethUtils.secp256k1.publicKeyCreate(privKey, true)
  keypair.privateKey = privKey
  keypair.publicKey = public_key
  return keypair
}

/**
 * 对指定内容进行签名，返回封装格式的数据
 * @param data 待签名的内容，内容的长度指定为32字节的内容（通常情况下是对内容的摘要进行签名）
 * @param keyPair 签名使用的密钥对，传递签名用的私钥 与验证签名的公钥
 * @returns {string}
 */
function userSign (data, keyPair) {
  //标识位+原文+签名+公钥+哈希;因为签名的内容，是源内容的摘要，所以定义原文为32字节 安装这种方式组织签名信息
  const msg = new Uint8Array(1 + 32 + 65 + 33 + 32)
  //ethUtils.sha256
  //msg 第一位保留
  msg[0] = 0
  msg.set(data, 1)
  let signed_ret = ethUtils.secp256k1.sign(data, keyPair.privateKey)
  msg.set(signed_ret.signature, 1 + 32)
  msg.set(signed_ret.recovery.toString(), 1 + 32 + 64)
  msg.set(keyPair.publicKey, 1 + 32 + 65)
  let digest = ethUtils.sha256(Array.from(msg.slice(1, 1 + 32 + 65 + 33)))
  msg.set(digest, 1 + 32 + 65 + 33)
  let hex = Buffer.from(msg).toString('hex')
  return hex
}

/**
 * 获取建立通信连接使用的数据
 * @param keyPair
 * @returns {string}
 */
function establish_connect_data (keyPair) {
  const data = randomBytes(32)
  return userSign(data, keyPair)
}

/**
 * 验证连接数据
 * @param siged_data 对端签名后的数据
 * @param secret 用户端的私钥，用于ECDH功能实现不通过网络传输数据，在服务端和客户端完成相同数据的协商
 * @returns {*} 客户端和服务端相同的一个数
 */
function verify_connect_data (siged_data, secret) {
  let data = Buffer.from(siged_data, 'hex')
  let pubkey = data.slice(1 + 32 + 65, 1 + 32 + 65 + 33)
  let result = verify_sign(siged_data)
  console.log("verify sign is:",result);
  if (result.result) {
    let agree = ethUtils.secp256k1.ecdh(pubkey, secret)
    return {'result':result.result, 'detail': agree}
  } else {
    return result
  }

}

/**
 * 验证签名数据是否合法
 * @param signed_data
 * @returns {*}
 */
function verify_sign (signed_data) {
  let verify_data = Buffer.from(signed_data, 'hex')
  // 预留位+原文+签名信息+sha 1 + 32 + 65 + 33 + 32
  let content = verify_data.slice(1, 1 + 32)
  let sig_data = verify_data.slice(1 + 32, 1 + 32 + 64)
  let pubkey = verify_data.slice(1 + 32 + 65, 1 + 32 + 65 + 33)
  let digest_rec = verify_data.slice(1 + 32 + 65 + 33)
  let digest_calc = ethUtils.sha256(Array.from(verify_data.slice(1, 1 + 32 + 65 + 33)))
  let result
  if (!digest_rec.equals(digest_calc)) {
    console.log('需要验证的消息与原始发送消息不一致!')
    result = {'result': false, 'detail': '需要验证的消息与原始发送消息不一致!'}
  } else {
    let verify_ret = ethUtils.secp256k1.verify(content, sig_data, pubkey)
    if (verify_ret) {
      //签名验证成功
      result = {'result': verify_ret}
    } else {
      result = {'result': verify_ret, 'detail': '签名使用密钥不匹配'}
    }
  }
  return result
}

function uuid () {
  let s = []
  let hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  let uuid = s.join('')
  return uuid
}

/**
 * 实现数据包装，前期是想实现统一的数据类型，达到跟交互方式无关的目的
 * @param name
 * @param data
 * @returns {string}
 */
function prepare_data (name, data) {

  let ret
  if (name == 'connectInit' || name == 'sendPubKey' || name == 'sendSign' || name == 'agreeRandom' || name == 'freshToken') {
    ret = {'cookie': cookie, 'data': data}
  } else {
    console.log('input method is undefine')
    ret = {'cookie': cookie, 'data': 'input method is undefine'}
  }
  let json_str = JSON.stringify(ret)
  return json_str
}

function encrypt (key,origndata) {
  
}

function decrypt () {
  
}

export { generate_keys_pair, establish_connect_data, prepare_data, verify_sign, verify_connect_data, userSign }

