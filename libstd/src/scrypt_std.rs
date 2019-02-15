use rust_scrypt;

const SALT: &str = "fd4acb81182a2c8fa959d180967b374277f2ccf2f7f401cb08d042cc785464b4";

fn to_bytes<A, T>(slice: &[T]) -> A
    where
        A: AsMut<[T]> + Default,
        T: Clone,
{
    let mut arr = Default::default();
    <A as AsMut<[T]>>::as_mut(&mut arr).clone_from_slice(slice);
    arr
}

pub fn test_scrypt_128()->Result<(),String> {

    let n:u32=262144;
    let p: u32 = 1;
    let r: u32 = 8;
    let log_n = (32 - n.leading_zeros() - 1) as u8;
    println!("log_n {}",log_n);
    if log_n as u32 >= r * 16 {
        return Err("InvalidN".to_string());
    }
    if p as u64 > ((u32::max_value() as u64 - 1) * 32)/(128 * (r as u64)) {
        return Err("InvalidP".to_string());
    }

    Ok(())

 /*  // let salt: [u8; 32] = to_bytes(hex::decode(SALT).unwrap());
    let mut salt = [0u8;32];
    let salt_str =  hex::decode(SALT).unwrap();
    salt.copy_from_slice(salt_str.as_slice());
    let passwd = "1234567890";
    let mut buf = [0u8; 16];
    let params = rust_scrypt::ScryptParams { n: 3, r: 8, p: 1 };

    rust_scrypt::scrypt(passwd.as_bytes(), &salt, &params, &mut buf);
    println!("{}",hex::encode(buf.as_ref()))*/
    //assert_eq!("52a5dacfcf80e5111d2c7fbed177113a", hex::encode(buf.as_ref()));
}