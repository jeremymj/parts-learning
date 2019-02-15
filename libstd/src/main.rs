#[macro_use]
extern crate serde_derive;

use libstd;
use std::env;
use scrypt::{scrypt, ScryptParams};

fn main() {
   /* let str = "0xFFFFFFFFFFFFf";
    let args: Vec<String> = env::args().collect();
    println!("{:?}",args);
    if args.len()!=1 {
        //读取命令行参数
        match args[1].as_str() {
            "-c"=>{
                println!("{:?}", args[2]);
            },
            _=>println!("parameter {} is not support",args[1]),
        }
    }

    println!("{}",str.to_lowercase());*/

    //scrypt_demo();
    trait_test();
}
use std::mem::size_of;
trait T{}

fn trait_test(){
    A::x{name:"sss".to_string()};
    assert_eq!(size_of::<&bool>(),size_of::<&u128>());
    assert_eq!(size_of::<&bool>(),size_of::<usize>());
    assert_eq!(size_of::<&dyn T>(),size_of::<usize>()*2);

}

mod A{
    pub struct x{
        name:String,
    }
}

///定义输入keystore文件格式，用于转换json格式文件
#[derive(Serialize, Deserialize)]
struct KeyStore{
    version:u8,
    id:String,
    address:String,
    crypto:Crypto,
}

#[derive(Serialize,Debug,Deserialize)]
struct Crypto{
    ciphertext:String,
    cipher:String,
    cipherparams:CipherParams,
    kdf:String,
    kdfparams:KdfParams,
    mac:String,
}

#[derive(Serialize,Debug,Deserialize)]
struct CipherParams{
    iv:String,
}

#[derive(Serialize,Debug,Deserialize)]
struct KdfParams{
    dklen:u8,
    salt:String,
    n:f32,
    r:u32,
    p:u32,
}

fn scrypt_demo(){
    let keystore = r#"{
    "version": 3,
    "id": "80d7b778-e617-4b35-bb09-f4b224984ed6",
    "address": "d280b60c38bc8db9d309fa5a540ffec499f0a3e8",
    "crypto": {
        "ciphertext": "58ac20c29dd3029f4d374839508ba83fc84628ae9c3f7e4cc36b05e892bf150d",
        "cipherparams": {
            "iv": "9ab7a5f9bcc9df7d796b5022023e2d14"
        },
        "cipher": "aes-128-ctr",
        "kdf": "scrypt",
        "kdfparams": {
            "dklen": 32,
            "salt": "63a364b8a64928843708b5e9665a79fa00890002b32833b3a9ff99eec78dbf81",
            "n": 262144,
            "r": 8,
            "p": 1
        },
        "mac": "3a38f91234b52dd95d8438172bca4b7ac1f32e6425387be4296c08d8bddb2098"
    }
}
"#;

    let store :KeyStore= serde_json::from_str(keystore).unwrap();
    println!("{},{}",store.address,store.version);
    println!("{:?}",store.crypto);
    let password = "12345";
    //对称加密密钥
    // let mut key = vec![0u8; 32];
    let mut key = [0u8; 32];
    let crypto = store.crypto;
    let kdfparams = crypto.kdfparams;

    let log_n =   kdfparams.n.log2() as u8;
    println!("log_n is:{}",log_n);
    let p = kdfparams.p;
    let r = kdfparams.r;

     let params = ScryptParams::new(18, r, p).unwrap();
    //let params = ScryptParams::new(19, r, p);

    let hex_salt = kdfparams.salt;

    let salt = hex::decode(hex_salt).unwrap();
    scrypt(password.as_bytes(), salt.as_slice(), &params, &mut key).expect("32 bytes always satisfy output length requirements");
    //rust_scrypt::scrypt(password.as_bytes(), salt.as_slice(), &params, &mut key);
    println!("scrypt data is {}",hex::encode(key));
}