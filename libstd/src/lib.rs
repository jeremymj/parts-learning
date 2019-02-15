#[macro_use]
extern crate serde_derive;

pub mod toml_pares;
pub mod lmdb_use;
pub mod uuid_std;
pub mod serde_json_std;
pub mod scrypt_std;

#[cfg(test)]
mod tests {
    use super::uuid_std;
    use super::toml_pares;
    use super::serde_json_std;
    use super::scrypt_std;
    #[test]
    fn uuid_test(){
        uuid_std::uuid_test();
    }

    #[test]
    fn parse_toml(){
        toml_pares::parse_toml();
        assert_eq!(1,2);
    }
    #[test]
    fn json_test(){
        //serde_json_std::serde_json_test();
        let f = 262144 as f32;
        println!("{}",f.log2());
        assert_eq!(1,2);
    }

    #[test]
    fn scrypt_test(){
        let ret = scrypt_std::test_scrypt_128();
        match ret {
            Ok(_)=>{

            },
            Err(e)=>{
                println!("error:{}",e)
            }
        }
        assert_eq!(1,2);
    }
}

