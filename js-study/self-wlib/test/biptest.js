const bip39Util = require("bip39")
const bip32Util = require('bip32')
const bip44Util = require('bip44-constants')

describe('Bip39 function test', function () {

  it('should produce lots of 0s', function () {
    //生成助记词
    let mnemonic = bip39Util.generateMnemonic()
    console.log("bip 39 mnemonic is:",mnemonic)
    //将助记词转换为hex buffer形式
    console.log("Seed is:",bip39Util.mnemonicToSeed(mnemonic,'123456').length)
    console.log("Seed Hex is:",bip39Util.mnemonicToSeedHex(mnemonic))
  })

})
/*
describe('Bip32 function test', function () {
  it('should produce lots of 0s', function () {
    //生成助记词
    let mnemonic = bip39Util.generateMnemonic()
    console.log("bip 39 mnemonic is:",mnemonic)
    let seed = bip39Util.mnemonicToSeed(mnemonic,'123456');
    let node = bip32Util.fromSeed(seed);
    console.log("node private key is:",node.privateKey.toString('hex'),",public key is:",node.publicKey.toString('hex'))
    let child = node.derivePath('m/0')
    console.log("m/0 is:",child,)
    let child1 = node.derivePath('m/1')
    console.log("m/1 is:",child1)
    let child2 = node.derivePath('m/2/0')
    console.log("m/2/0 is:",child2)

   let node1 =  bip32Util.fromPublicKey(child.publicKey,child.chainCode)
    console.log("node1 is:",node1)

    let node3 = bip32Util.fromBase58('xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi')
    console.log("node3 is:",node3)

  })
})*/

/*

describe('Bip44 function test', function () {
  it('should produce lots of 0s', function () {
    //生成助记词
    Object.keys(bip44Util).forEach(coinSymbol => {
      const constant = bip44Util[coinSymbol]

      // ...
      console.log(coinSymbol, constant)
    })

  })
})*/
