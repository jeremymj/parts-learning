#![allow(unused_variables)]
#![cfg_attr(feature = "cargo-clippy", allow(needless_pass_by_value))]

#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde_derive;

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
use lmdb_rs::{DbFlags, EnvBuilder as Lmdb_EnvBuilder};
use scryinfo::scry_author::helper;
use scryinfo::scry_grpc::author::scryinfo_author::AuthorDataRequest;
use scryinfo::scry_grpc::author::scryinfo_author_grpc::AuthorClient;
use serde_json::{Value};

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

fn user_login(params: Form<MyParams>) -> Result<HttpResponse> {
    println!("post data is:{}", params.data);

    let env = Arc::new(EnvBuilder::new().build());
    let ch = ChannelBuilder::new(env).connect("172.17.0.1:48080");
    let client = AuthorClient::new(ch);
    let mut request = AuthorDataRequest::new();
    request.set_data(params.data.clone());
    let reply = client.verify_token(&request).unwrap();
    let result = format!("detail info is:{},public key:{},token:{},agree_key:{}", reply.get_detail(), reply.get_public_key(), reply.get_token(), reply.get_agree_key());
    {
        let mut repos_mut = repos.lock().unwrap();
        repos_mut.insert(reply.get_token().to_string(), (reply.get_public_key().to_string(), reply.get_agree_key().to_string()));
    }

    println!("verify token result is:{}", result);

    Ok(HttpResponse::build(http::StatusCode::OK)
        .content_type("text/plain")
        .body(format!("{{\"data\":\"{}\"}}", params.data)))
}


pub fn get_decrypted_data(token: &str, encrypted_data: &str) -> std::string::String {
    let repos_lock = repos.lock().unwrap();
    let keys = &repos_lock[&String::from(token)];
    let agree_key = keys.1.trim_matches('"');
    println!("agree key:{}", agree_key);
    println!("encrypted data is:{}", encrypted_data);
    //decrypt_content(data: &str, agree_key: &str)
    let result = helper::aes::decrypt_content(encrypted_data, agree_key);
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
    println!("recevie data is:{}",receive_data);
    let resp_data = helper::aes::encrypt_content(receive_data.as_bytes(), agree_key);
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
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN,"127.0.0.1")
        .body(format!("{{\"data\":\"{}\"}}", resp_data)))
}

fn main() {
    /*  env::set_var("RUST_LOG", "actix_web=debug");
      env::set_var("RUST_BACKTRACE", "1");
      env_logger::init();*/
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
                    .header(header::ACCESS_CONTROL_ALLOW_ORIGIN,"127.0.0.1")
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
