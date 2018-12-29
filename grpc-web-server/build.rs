extern crate protoc_grpcio;

fn main() {
    let proto_root = "protos";
    protoc_grpcio::compile_grpc_protos(
        &["greet.proto"],
        &[proto_root],
        &proto_root
    ).expect("Failed to compile gRPC definitions!");
}