use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Default, Serialize, Deserialize, Debug)]
pub enum BookType {
    #[default]
    Manga,
    Novel,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BookMetadata {
    pub title: String,
    pub author: String,
    pub language: String,

    pub current_page: usize, // cant be negative so i use usize (YES I)
    pub last_opened: SystemTime,
    pub created_date: SystemTime,
}

impl Default for BookMetadata {
    fn default() -> Self {
        let now = SystemTime::now();

        Self {
            title: String::default(),
            author: String::default(),
            language: String::default(),
            current_page: 0,
            last_opened: now,
            created_date: now,
        }
    }
}

impl BookMetadata {
    pub fn new(title: String, author: String, language: String) -> Self {
        let now = SystemTime::now();

        Self {
            title: title,
            author: author,
            language: language,
            current_page: 0,
            last_opened: now,
            created_date: now,
        }
    }
}

#[derive(Default, Serialize, Deserialize, Debug)]
pub struct Book {
    // identifiers so the actual thing can process it correctly :p
    pub book_type: BookType,
    pub id: String,

    pub favorite: bool,

    pub location: String,
    pub cover_location: String,
    pub pages: Vec<String>,

    pub metadata: BookMetadata,
}
