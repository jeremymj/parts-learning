use uuid::Uuid;

pub fn uuid_test() {
    let my_uuid = Uuid::new_v4();
    // dbg!(my_uuid);
    println!("uuid string:{}",my_uuid.to_string());
    println!("uuid hyphenated:{}",my_uuid.to_hyphenated());
    let token = my_uuid.to_simple();
    println!("uuid simple:{}",token.to_string());
    println!("uuid urn:{}",my_uuid.to_urn());
}
