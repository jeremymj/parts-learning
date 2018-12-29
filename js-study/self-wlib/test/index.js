const secp256k1 = require('secp256k1')
const {randomBytes} = require('crypto')
const ethUtils = require('ethereumjs-util')
const scryUtil = require('../lib/scrylib')

const {AuthorDataRequest} = require('../lib/grpc/scryinfo-author_pb')
const {AuthorClient} = require('../lib/grpc/scryinfo-author_grpc_web_pb')

describe('secp256k1 function test', function () {
  it('should produce lots of 0s', function () {
// generate privKey
    const msg = randomBytes(32)
    console.log('msg is:', msg.toString('hex'), msg.length)

    let privKey
    let conunt = 0
    do {
      conunt++
      privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey))
    let public_key = secp256k1.publicKeyCreate(privKey, true)
    console.log('private key is:', privKey.toString('hex'), ',count:', conunt)
    console.log('public len is:', public_key.length, 'public key is:', public_key.toString('hex').toUpperCase())

    const digest = ethUtils.sha256(msg)
    console.log('hex is:', ethUtils.addHexPrefix(digest.toString('hex')))
    // sign the message
    const sigObj = secp256k1.sign(msg, privKey)
    console.log('sig length is', sigObj.signature.byteLength, 'sigObj.recovery ', sigObj.recovery)
    //这个方法的签名是原生的
    let result_sig = ethUtils.ecsign(msg, privKey)
    console.log('signed is:', result_sig.toString('hex'))

    // verify the signature
    console.log(secp256k1.verify(msg, sigObj.signature, public_key))
    const pair_data = new Array()
    pair_data[0] = 0
    console.log(pair_data.length)

    const byte_demo = new Uint8Array(3)
    console.log('length is:', byte_demo.byteLength, ', num:', byte_demo)

  })
})

describe('establish_connect_data test', function () {
  it('sign data', function () {
    let privKey
    do {
      privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey))

    //标识位+原文+签名+公钥+哈希;因为签名的内容，是源内容的摘要，所以定义原文为32字节 安装这种方式组织签名信息
    const msg = new Uint8Array(1 + 32 + 65 + 33 + 32)
    //msg 第一位保留
    msg[0] = 0
    const data = randomBytes(32)
    msg.set(data, 1)
    let signed_ret = ethUtils.secp256k1.sign(data, privKey)
    msg.set(signed_ret.signature, 33)

    msg.set(signed_ret.recovery.toString(), 1 + 32 + 64)
    let public_key = ethUtils.secp256k1.publicKeyCreate(privKey, true)
    msg.set(public_key, 1 + 32 + 65)
    let digest = ethUtils.sha256(data)
    msg.set(digest, 1 + 32 + 65 + 33)
    let hex = Buffer.from(msg).toString('hex')
    console.log('msg data:', hex)
  })

})


describe('sign test', function () {
  it('check again', function () {
    let method = [1,2,3,4];
    console.log("sub array:",method.slice(1,3));
  })
})