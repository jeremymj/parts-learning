use std::{io, thread};
use std::io::Read;
use std::sync::Arc;

use futures::Future;
use futures::sync::oneshot;
use grpcio::{Environment, ServerBuilder};

use protos::greet::GreetRequest;
use protos::greet::GreetResponse;
use protos::greet_grpc::{self, GreetExample};

#[derive(Clone)]
struct UserGreet;

impl GreetExample for UserGreet {
    fn say_hello(&mut self, ctx: ::grpcio::RpcContext, req: GreetRequest, sink: ::grpcio::UnarySink<GreetResponse>) {
        let hello = format!("greeter:name {},age:{}", &req.get_name(), req.get_age());
        println!("{}", hello);
        let mut resp = GreetResponse::new();
        let resp_str = format!("hello {}", req.get_name());
        resp.set_msg(resp_str);
        let f = sink
            .success(resp)
            .map_err(move |e| println!("failed to reply {:?}: {:?}", req, e));
        ctx.spawn(f)
    }
}

fn method_test(){

    use scryinfo::scry_author::helper;
    use std::time::{SystemTime, UNIX_EPOCH};

    let start = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
    let start_ms = start.as_secs() * 1000 + start.subsec_nanos() as u64 / 1000_000;
    for _i in 0..40 {
        helper::eckey::generate_keys_pair();
    }
    let end = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
    let end_ms = end.as_secs() * 1000 + end.subsec_nanos() as u64 / 1000_000;

    println!("use ms is:{}", end_ms - start_ms);
}

fn main() {
    let env = Arc::new(Environment::new(1));

    let userservice = greet_grpc::create_greet_example(UserGreet);
    let mut server = ServerBuilder::new(env)
        .register_service(userservice)
        .bind("172.17.0.1", 48_080)
        .build()
        .unwrap();
    server.start();
    for &(ref host, port) in server.bind_addrs() {
        println!("service listening on {}:{}", host, port);
    }
    let (tx, rx) = oneshot::channel();
    thread::spawn(move || {
        println!("Press ENTER to exit...");
        let _ = io::stdin().read(&mut [0]).unwrap();
        tx.send(())
    });
    let _ = rx.wait();

}
