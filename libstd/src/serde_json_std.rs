use serde_json::{Value,Result};
use serde::{Deserialize,Serialize};
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
    n:u32,
    r:u16,
    p:u16,
}

pub fn serde_json_test(){
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

}
