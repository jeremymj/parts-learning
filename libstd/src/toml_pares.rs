
#[derive(Debug, Deserialize)]
struct ServerConfig {
    ip: Option<String>,
    port: Option<u64>,
}

#[derive(Debug, Deserialize)]
struct Config {
    global_string: Option<String>,
    global_integer: Option<u64>,
    server: Option<ServerConfig>,
}

pub fn parse_toml(){
    let toml_str = r#"
        global_string = "test"
        global_integer = 5

        [server]
        ip = "127.0.0.1"
        port = 80

        [[peers]]
        ip = "127.0.0.1"
        port = 8080

        [[peers]]
        ip = "127.0.0.1"
    "#;

    let decoded:Config = toml::from_str(toml_str).unwrap();

    println!("{:#?}",  decoded.server.unwrap());
}