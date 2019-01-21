use uuid::Uuid;
use lmdb::{EnvBuilder, DbFlags};


pub fn uuid_test() {
    let my_uuid = Uuid::new_v4();
   // dbg!(my_uuid);
    println!("uuid string:{}",my_uuid.to_string());
    println!("uuid hyphenated:{}",my_uuid.to_hyphenated());
    let token = my_uuid.to_simple();
    println!("uuid simple:{}",token.to_string());
    println!("uuid urn:{}",my_uuid.to_urn());
}

pub fn lmdb_test(){
   let env =  EnvBuilder::new().open("test-lmdb",0o777).unwrap();

    let db_handle = env.get_default_db(DbFlags::empty()).unwrap();
    let txn = env.new_transaction().unwrap();
    {
        let db = txn.bind(&db_handle); // get a database bound to this transaction

        let pairs = vec![("Albert", "Einstein",),
                         ("Joe", "Smith",),
                         ("Jack", "Daniels")];

        for &(name, surname) in pairs.iter() {
            db.set(&surname, &name).unwrap();
        }
    }

    // Note: `commit` is choosen to be explicit as
    // in case of failure it is responsibility of
    // the client to handle the error
    match txn.commit() {
        Err(_) => panic!("failed to commit!"),
        Ok(_) => ()
    }

    let reader = env.get_reader().unwrap();
    let db = reader.bind(&db_handle);
    let name = db.get::<&str>(&"Smith").unwrap();
    println!("It's {} Smith", name);
}