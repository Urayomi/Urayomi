// use rusqlite::{Connection, Result};
// use std::path::PathBuf;

// pub fn initiate(path: &PathBuf) -> Result<()> {
//     let conn = Connection::open(path.join("manga.db"))?;
//     println!("Creating DB at {:?}", path.join("manga.db"));
//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS manga (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             author TEXT NOT NULL,
//             description TEXT,
//             image_url TEXT,
//             status TEXT
//         )",
//         [],
//     )?;

//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS chapter (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             manga_id INTEGER NOT NULL,
//             name TEXT NOT NULL,
//             url TEXT NOT NULL,
//             scanlator TEXT,
//             date_upload TEXT,
//             FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE
//         )",
//         [],
//     )?;

//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS genre (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             name TEXT UNIQUE NOT NULL
//         )",
//         [],
//     )?;

//     conn.execute(
//         "CREATE TABLE IF NOT EXISTS manga_genre (
//             manga_id INTEGER NOT NULL,
//             genre_id INTEGER NOT NULL,
//             PRIMARY KEY (manga_id, genre_id),
//             FOREIGN KEY (manga_id) REFERENCES manga(id) ON DELETE CASCADE,
//             FOREIGN KEY (genre_id) REFERENCES genre(id) ON DELETE CASCADE
//         )",
//         [],
//     )?;

//     Ok(())
// }
