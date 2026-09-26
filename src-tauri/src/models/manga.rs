use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize, Debug)]
pub struct Manga {
    pub location: String,
    pub cover_location: String, // would usually be first picture in manga
    pub pages: Vec<String>,     // [location, location, location]
    pub current_page: i32,
    pub name: String,
    pub favorite: bool,
}
