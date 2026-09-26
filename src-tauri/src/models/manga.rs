use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize, Debug)]
pub struct Manga {
    // unique identifier for the manga so we can fetch it using its id instead of its straight path;
    pub id: String,
    pub location: String,
    pub cover_location: String, // would usually be first picture in manga
    pub pages: Vec<String>,     // [location, location, location]
    pub current_page: usize,
    pub name: String,
    pub favorite: bool,

    pub last_opened: i32,
}
