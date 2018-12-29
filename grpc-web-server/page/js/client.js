const {GreetRequest, GreetResponse} = require("./lib/greet_pb.js");
const {GreetExampleClient} = require("./lib/greet_grpc_web_pb.js");

var client = new GreetExampleClient('http://localhost:8080');
var request = new GreetRequest();
request.setName("Alice");
request.setAge("25");
client.sayHello(request, {}, (error, response) => {
    console.log(response.getMsg());
});