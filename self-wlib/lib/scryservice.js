const scryUtil = require('./scrylib')
const bip39Util = require('bip39')
const bip32Util = require('bip32')

const {AuthorDataRequest} = require('./grpc/scryinfo-author_pb.js')
const {AuthorClient} = require('./grpc/scryinfo-author_grpc_web_pb.js')

const scryservice = {}

/*scryservice.init = function (host) {
  this.client = new AuthorClient(host)
  this.context = {agree: null, token: null}*/

/**
 *
 */

let client

function connectInit () {
  //开始协商通信对称加密密钥
  let connect_keypair = scryUtil.generate_keys_pair()
  console.log('publickey:', connect_keypair.publicKey.toString('hex'), 'privatekey:' + connect_keypair.privateKey.toString('hex'))
  let connect_data = scryUtil.establish_connect_data(connect_keypair)
  let init_data = scryUtil.prepare_data('connectInit', connect_data)
  let req = new AuthorDataRequest()
  req.setData(init_data)

  return new Promise(function (resolve, reject) {
    client.connectInit(req, {}, (error, response) => {
      if (error != null) {
        log(error)
        reject(error.message)
      } else {
        let result = scryUtil.verify_connect_data(response.getDetail(), connect_keypair.privateKey)
        if (result.result) {
          scryservice.agree = result.detail
          resolve(result.detail)
          localStorage.setItem('AesKey',result.detail.toString('hex'))
          console.log('agree encrypt key is:', result.detail)
        } else {
          reject(result.detail)
          console.log(result.detail)
        }
      }

    })
  })

}

function getAgreeRandom () {
  //开始协商随机数
  let req = new AuthorDataRequest()
  let rand_keypair = scryUtil.generate_keys_pair()
  let rand_data = scryUtil.establish_connect_data(rand_keypair)
  let data = scryUtil.prepare_data('agreeRandom', rand_data)
  req.setData(data)
  return new Promise(function (resolve, reject) {
    client.agreeRandom(req, {}, (error, response) => {
      //ToDo 需要对协商随机数的结果做分步的处理
      let random = scryUtil.verify_connect_data(response.getDetail(), rand_keypair.privateKey)
      log('random:' + random)
      if (random.result) {
        alert('需要对当前会话进行认证')
        resolve(random.detail)
      } else {
        reject(random.detail)
      }

    })
  })

}

scryservice.getMnemonic = function () {
  let mnemonic = bip39Util.generateMnemonic()
  return mnemonic
}

/*let seed = bip39Util.mnemonicToSeed(mnemonic)
let node = bip32Util.fromSeed(seed)
console.log('node private key is:', node.privateKey.toString('hex'), ',public key is:', node.publicKey.toString('hex'))*/

//验证随机数，验证通过后，则生成token
function verifyRandom (random) {
  //先暂时将公私钥使用随机密钥代替,这个地方需要获取用户的公钥和私钥
  let rand_keypair = scryUtil.generate_keys_pair()
  let signed_data = scryUtil.userSign(random, rand_keypair)
  let prepare_signed_data = scryUtil.prepare_data('sendSign', signed_data)
  let req = new AuthorDataRequest()
  req.setData(prepare_signed_data)
  return new Promise(function (resolve, reject) {
    client.agreeToken(req, {}, (error, response) => {
      console.log('agree token is:', response.getDetail())
      const token = response.getDetail()
      resolve(token)
    })
  })
}

scryservice.test = function (address) {
  log('start service')
  //创建一个Promise实例
  let demo = new Promise(function (resolve, reject) {
    client = new AuthorClient(address)
    resolve()
  })

  demo.then(connectInit)
    .then(getAgreeRandom)
    .then(verifyRandom)
    .then(token=> {
      log("产生的token为:"+token.toString())
      localStorage.setItem("token",token)
    }).catch(function (err) {
    log(err)
  })
}

module.exports = scryservice

function log (s) {
  console.log(s)
}

