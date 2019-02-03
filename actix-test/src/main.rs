#![allow(unused_variables)]
#![cfg_attr(feature = "cargo-clippy", allow(needless_pass_by_value))]

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde_derive;

use serde_json::Value;
use std::{env, io, path::PathBuf};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use actix_web::{
    App, error, Error, Form, fs, http, HttpRequest, HttpResponse, middleware, Path, pred, Result,
    server,
};
use actix_web::http::{header, Method, StatusCode};
use actix_web::middleware::session::{self, RequestSession};
use bytes::Bytes;
use futures::future::{FutureResult, result};
use futures::Stream;
use futures::sync::mpsc;
use grpcio::{ChannelBuilder, EnvBuilder};

use scryinfo::{self, author};
use scryinfo::grpcproto::scryinfo_author::{AuthorDataRequest, AccessTokenRequest, AuthorDataResponse};
use scryinfo::grpcproto::scryinfo_author_grpc::AuthorClient;


lazy_static! {
    pub static ref  repos:Mutex<HashMap<String, (String,String)>> = Mutex::new(HashMap::new());
}

/// favicon handler
fn favicon(req: &HttpRequest) -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("static/images/favicon.ico")?)
}

/// simple index handler
fn welcome(req: &HttpRequest) -> Result<HttpResponse> {
    println!("{:?}", req);

    // session
    let mut counter = 1;
    if let Some(count) = req.session().get::<i32>("counter")? {
        println!("SESSION value: {}", count);
        counter = count + 1;
    }

    // set counter to session
    req.session().set("counter", counter)?;

    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/page/welcome.html")))
}

/// 404 handler
fn p404(req: &HttpRequest) -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("static/page/404.html")?.set_status_code(StatusCode::NOT_FOUND))
}

/// async handler
fn index_async(req: &HttpRequest) -> FutureResult<HttpResponse, Error> {
    println!("{:?}", req);

    result(Ok(HttpResponse::Ok().content_type("text/html").body(
        format!("Hello {}!", req.match_info().get("name").unwrap()),
    )))
}

/// async body
fn index_async_body(path: Path<String>) -> HttpResponse {
    let text = format!("Hello {}!", *path);

    let (tx, rx_body) = mpsc::unbounded();
    let _ = tx.unbounded_send(Bytes::from(text.as_bytes()));

    HttpResponse::Ok()
        .streaming(rx_body.map_err(|e| error::ErrorBadRequest("bad request")))
}


/// handler with path parameters like `/user/{name}/`
fn with_param(req: &HttpRequest) -> HttpResponse {
    println!("{:?}", req);

    HttpResponse::Ok()
        .content_type("text/plain")
        .body(format!("Hello {}!", req.match_info().get("name").unwrap()))
}


#[derive(Deserialize)]
pub struct MyParams {
    data: String,
}

#[derive(Deserialize)]
pub struct SubmitOrder {
    access_token: String,
    order_detail: String,
}

fn user_login(params: Form<MyParams>) -> Result<HttpResponse> {
    println!("post data is:{}", params.data);

    let env = Arc::new(EnvBuilder::new().build());
    let ch = ChannelBuilder::new(env).connect("192.168.202.1:48080");
    let client = AuthorClient::new(ch);
    let mut request = AuthorDataRequest::new();
    request.set_data(params.data.clone());
    let reply: AuthorDataResponse = client.verify_token(&request).unwrap();
    let mut resp_data;
    if reply.get_status() {
        let result = format!("public key:{},token:{},agree_key:{}", reply.get_public_key(), reply.get_token(), reply.get_agree_key());
        {
            let mut repos_mut = repos.lock().unwrap();
            repos_mut.insert(reply.get_token().to_string(), (reply.get_public_key().to_string(), reply.get_agree_key().to_string()));
        }
        resp_data = author::msg_process::encrypt_content(result.as_bytes(), reply.get_agree_key());
        println!("verify token result is:{}", result);
    } else {
        resp_data = String::from("请先认证");
    }

    Ok(HttpResponse::build(http::StatusCode::OK)
        .content_type("text/plain")
        .body(format!("{{\"data\":\"{}\"}}", resp_data)))
}


pub fn get_decrypted_data(token: &str, encrypted_data: &str) -> std::string::String {
    let repos_lock = repos.lock().unwrap();
    let keys = &repos_lock[&String::from(token)];
    let agree_key = keys.1.trim_matches('"');
    println!("agree key:{}", agree_key);
    println!("encrypted data is:{}", encrypted_data);
    //decrypt_content(data: &str, agree_key: &str)
    let result = author::msg_process::decrypt_content(encrypted_data, agree_key);
    let receive_data = match result {
        Ok(data) => {
            //println!("decrypt data is:{}",String::from_utf8(data).unwrap());
            String::from_utf8(data).unwrap()
        }
        Err(e) => {
            println!("{}", e);
            e
        }
    };
    println!("recevie data is:{}", receive_data);

    let resp_data = author::msg_process::encrypt_content(receive_data.as_bytes(), agree_key);
    println!("{}", resp_data);
    resp_data
}

fn add_notice_method(params: Form<MyParams>) -> Result<HttpResponse> {
    let data = params.data.clone();
    println!("add_notice_method:{}", data);

    let req_data_json: Value = serde_json::from_str(&data).unwrap();
    //获取到token
    let token = req_data_json["token"].to_string();
    //
    let token_str = token.trim_matches('"');
    //加密的数据
    let encrypt_data = req_data_json["data"].to_string();
    let encrypt_data_str = encrypt_data.trim_matches('"');
    let resp_data = get_decrypted_data(token_str, encrypt_data_str);
    Ok(HttpResponse::build(http::StatusCode::OK)
        .content_type("text/plain")
        .body(format!("{{\"data\":\"{}\"}}", resp_data)))
}

fn require_authorization(params: Form<MyParams>) -> Result<HttpResponse> {
    let data = params.data.clone();
    println!("query request need author:{}", data);
    // TODO 添加对用户是否认证的检查
    let puk = author::eckey::load_public_key();
    //关于是否需要认证,这个地方可以通过查询相关配置文件
    let resp_data = format!("{{\"result\":\"{}\",\"public_key\":\"{}\",\"datatype\":\"{}\"}}", true, puk, "UserBasicInfo");
    println!("require_authorization data is:{}", resp_data);
    Ok(HttpResponse::build(http::StatusCode::OK)
        .content_type("text/plain")
        .body(resp_data))
}

fn submit_order(params: Form<SubmitOrder>) -> Result<HttpResponse> {
    println!("submit_order.................");
    let order_data = params.order_detail.clone();
    let access_token = params.access_token.clone();
    println!("submit_order:{},access token:{}", order_data, access_token);
    let req_data_json: Value = serde_json::from_str(&order_data).unwrap();
    //获取到token,这个token与用户信息进行关联
    let token = req_data_json["token"].to_string();
    let token_str = token.trim_matches('"');
    //加密的数据，用户提交的数据
    let encrypt_data = req_data_json["data"].to_string();
    let encrypt_data_str = encrypt_data.trim_matches('"');

    let req_data = get_decrypted_data(token_str, encrypt_data_str);

    let env = Arc::new(EnvBuilder::new().build());
    let ch = ChannelBuilder::new(env).connect("192.168.202.1:48080");
    let client = AuthorClient::new(ch);
    let mut request = AccessTokenRequest::new();
    request.set_token(access_token);
    let response = client.get_data_by_access_token(&request).unwrap();
    let resp_data;
    if response.get_status() {
        println!("user data is:{}", response.get_detail());
        resp_data = format!("{{\"result\":\"{}\"}}", true);
    } else {
        resp_data = format!("{{\"result\":\"{}\",\"msg\":\"{}\"}}", false, response.get_detail());
    }
    Ok(HttpResponse::build(http::StatusCode::OK)
        .content_type("text/text")
        .body(resp_data))
}

fn main() {
    env::set_var("RUST_LOG", "actix_web=debug");
    env::set_var("RUST_BACKTRACE", "1");
    env_logger::init();

    let pair = scryinfo::util::fs::check_file_exist("keystore");

    match pair {
        Some(file) => println!("keystore file is exist!"),
        None => {
            let generate_flag = author::account::create_account("123456", true, author::eckey::EcKey::FILE);
            match generate_flag {
                Ok(flag) => {
                    println!("服务端密钥初始化结束");
                }
                Err(e) => {
                    println!("{}", e.to_string());
                }
            }
        }
    }
    let sys = actix::System::new("basic-example");

    let addr = server::new(
        || App::new()
// enable logger
            .middleware(middleware::Logger::default())
// cookie session middleware
            .middleware(session::SessionStorage::new(
                session::CookieSessionBackend::signed(&[0; 32]).secure(false)
            ))
// register favicon
            .resource("/favicon", |r| r.f(favicon))
// register simple route, handle all methods
            .resource("/welcome", |r| r.f(welcome))
// with path parameters
            .resource("/user/{name}", |r| r.method(Method::GET).f(with_param))
// async handler
            .resource("/async/{name}", |r| r.method(Method::GET).a(index_async))
// async handler
            .resource("/async-body/{name}", |r| r.method(Method::GET).with(index_async_body))
            .resource("/userLogin", |r| r.method(Method::POST).with(user_login))
            .resource("/addNoticeMethod", |r| r.method(Method::POST).with(add_notice_method))
            .resource("/isAuthorAccess", |r| r.method(Method::POST).with(require_authorization))
            .resource("/submitOrder", |r| r.method(Method::POST).with(submit_order))
            .resource("/test", |r| r.f(|req| {
                match *req.method() {
                    Method::GET => HttpResponse::Ok(),
                    Method::POST => HttpResponse::MethodNotAllowed(),
                    _ => HttpResponse::NotFound(),
                }
            }))
            .resource("/error", |r| r.f(|req| {
                error::InternalError::new(
                    io::Error::new(io::ErrorKind::Other, "test"), StatusCode::INTERNAL_SERVER_ERROR)
            }))
            // static files
            .handler("/static", fs::StaticFiles::new("static").unwrap())
            // redirect
            .resource("/", |r| r.method(Method::GET).f(|req| {
                println!("{:?}", req);
                HttpResponse::Found()
                    .header(header::LOCATION, "static/page/welcome.html")
                    .finish()
            }))
            // default
            .default_resource(|r| {
                // 404 for GET request
                r.method(Method::GET).f(p404);

                // all requests that are not `GET`
                r.route().filter(pred::Not(pred::Get())).f(
                    |req| HttpResponse::MethodNotAllowed());
            }))

        .bind("127.0.0.1:9080").expect("Can not bind to 127.0.0.1:9080")
        .shutdown_timeout(0)    // <- Set shutdown timeout to 0 seconds (default 60s)
        .start();

    println!("Starting http server: 127.0.0.1:9080");
    let _ = sys.run();
}
