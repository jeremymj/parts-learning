const scryService = require('./lib/scryservice')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
}



let msg = scryService.init('http://localhost:8080')
demo();
console.log("msg is:",msg)
/*let token = localStorage.getItem('token')
let key = localStorage.getItem("AesKey")
console.log("协商产生的key:",key.toString('hex'),",Token：",token)*/

  setTimeout(val=>{
    console.log("msg is:",msg)
    let token = localStorage.getItem('token')
    let key = localStorage.getItem("AesKey")
    console.log("协商产生的key:",key.toString('hex'),",Token：",token)
  },1000,'hello')
console.log("execute is over!")


/*if (window.localStorage) {
  let flag = localStorage.getItem('HasInit1')
  console.log('check flag:', flag)
  //若浏览器针对该应用
  if (flag == null) {
    //没有执行初始化，则需要提供公私钥来进行初始化操作
    let mnemonic = scryService.getMnemonic()
    alert('助记词为:'+mnemonic)
    let ep = document.createElement("p")
    let node = document.createTextNode('助记词为:'+mnemonic+',请保存在安全的地方')
    ep.appendChild(node)

    let promise = new Promise(function (resolve, reject) {
      console.log("first execute")
      resolve(1);
    });

    scryService.init('http://localhost:8080')
    scryService.connectInit().then(scryService.getToken).then(scryService.verifyRandom).catch(function (err) {
      console.log(err)
    })



    localStorage.setItem('HasInit', 'true')
  } else {
    console.log('该浏览器已经执行过初始化操作')
  }

} else {
  alert('当前浏览器不满足使用要求')
}*/


/*   promise.then(function (num) {
      scryService.connectInit()
      console.log("num is ",num)
    }).then().then(function () {
      scryService.getToken()
      console.log("agree:",scryService.agree,",token:",scryService.token)
    }).catch(function (info) {
      console.log(info)
    });*/
/*
    scryService.connectInit()
    console.log('scryService agree is:', agree)
    scryService.getToken()
    console.log('scryService token is:', token)*/




