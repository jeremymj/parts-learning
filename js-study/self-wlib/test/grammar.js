async  function testAsync () {
  return "hello async"
}

function getSomeThing () {
  return "something"
}
async function test () {
  const v1 = await getSomeThing()
  const v2 = await testAsync()
  console.log(v1,v2)
  return 'test is over'
}

/*
const result = testAsync()
console.log(result)*/

//console.log(test())

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two seconds later');
}

demo();
console