use rand::{distr::Alphanumeric, RngExt};
use serde::{Deserialize, Serialize};
use std::{path::PathBuf, time::SystemTime};

use crate::models::BookMetadata;

#[derive(Default, Serialize, Deserialize, Debug)]
pub enum BookType {
    #[default]
    Manga,
    Novel,
}

#[derive(Default, Serialize, Deserialize, Debug)]
pub struct Book {
    // identifiers so the actual thing can process it correctly :p
    pub book_type: BookType,
    pub id: String,

    pub favorite: bool,

    pub location: PathBuf,
    pub cover_location: String,
    pub pages: Vec<String>,

    pub metadata: BookMetadata,
}

impl Book {
    pub fn new(
        book_type: BookType,
        location: PathBuf,
        cover_location: String,
        pages: Vec<String>,
        metadata: BookMetadata,
    ) -> Self {
        Self {
            book_type,
            id: rand::rng()
                .sample_iter(&Alphanumeric)
                .take(16)
                .map(char::from)
                .collect(),
            favorite: false,
            location,
            cover_location,
            pages,
            metadata,
        }
    }
}
