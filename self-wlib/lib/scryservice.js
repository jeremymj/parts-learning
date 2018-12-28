const scryUtil = require('./scrylib')
const bip39Util = require('bip39')
const bip32Util = require('bip32')

const {AuthorDataRequest} = require('./grpc/scryinfo-author_pb.js')
const {AuthorClient} = require('./grpc/scryinfo-author_grpc_web_pb.js')

const scryservice = {}

scryservice.init = function (host) {
  this.client = new AuthorClient(host)
  this.context = {agree: null, token: null}
}

scryservice.connectInit = function () {
    //开始协商通信对称加密密钥
    let connect_keypair = scryUtil.generate_keys_pair()
    console.log('publickey:', connect_keypair.publicKey.toString('hex'), 'privatekey:' + connect_keypair.privateKey.toString('hex'))
    let connect_data = scryUtil.establish_connect_data(connect_keypair)
    let init_data = scryUtil.prepare_data('connectInit', connect_data)
    let req = new AuthorDataRequest()
    req.setData(init_data)
    this.client.connectInit(req, {}, (error, response) => {
      let result = scryUtil.verify_connect_data(response.getDetail(), connect_keypair.privateKey)
      if (result.result){
        scryservice.agree = result.detail
        resolve(result.detail)
        console.log('agree encrypt key is:', result.detail)
      }else {
       console.log(result.detail)
      }
    })
}
scryservice.getToken = function () {
    //开始协商随机数
    let req = new AuthorDataRequest()
    let rand_keypair = scryUtil.generate_keys_pair()
    let rand_data = scryUtil.establish_connect_data(rand_keypair)
    let data = scryUtil.prepare_data('agreeRandom', rand_data)
    req.setData(data)
    this.client.agreeRandom(req, {}, (error, response) => {
      let random = scryUtil.verify_connect_data(response.getDetail(), rand_keypair.privateKey)
      alert('需要对当前会话进行认证')
      //对随机数进行签名,获取token
     // verifyRandom(random)
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
scryservice.verifyRandom = function(random) {
  //先暂时将公私钥使用随机密钥代替,这个地方需要获取用户的公钥和私钥
    let rand_keypair = scryUtil.generate_keys_pair()
    let signed_data = scryUtil.userSign(random, rand_keypair)
    let prepare_signed_data = scryUtil.prepare_data('sendSign', signed_data)
    let req = new AuthorDataRequest()
    req.setData(prepare_signed_data)

    scryservice.client.agreeToken(req, {}, (error, response) => {
      console.log('agree token is:', response.getDetail())
      const token = response.getDetail()
    })
}

module.exports = scryservice



