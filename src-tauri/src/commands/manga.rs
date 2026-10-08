use std::fs::{create_dir_all, File};
use std::io::{copy, Write};
use std::path::Path;

use image::ImageReader;
use rand::distr::Alphanumeric;
use rand::RngExt;
use tauri::{AppHandle, Manager};

use crate::models::{Book, BookMetadata, BookType};

const EXTENSIONS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico"];
const NOVEL_EXTENSIONS: &[&str] = &["html", "html"];

#[tauri::command]
pub fn process_manga(
    app: AppHandle,
    path: &str,
    name: &str,
    novel: bool,
) -> Result<Vec<String>, String> {
    let file = File::open(path).map_err(|e| e.to_string())?;

    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    let output_dir = data_dir.join("manga").join(name);

    create_dir_all(&output_dir).map_err(|e| e.to_string())?;

    let thumbnail_dir = output_dir.join("thumbnail");
    create_dir_all(&thumbnail_dir).map_err(|e| e.to_string())?;
    let mut pages = Vec::new();
    let mut images = Vec::new();
    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;

        if file.is_dir() {
            continue;
        }

        let filename = Path::new(file.name())
            .file_name()
            .ok_or_else(|| "Invalid filename".to_string())?;

        let extension = match Path::new(filename).extension().and_then(|ext| ext.to_str()) {
            Some(ext) => ext.to_ascii_lowercase(),
            none => continue,
        };

        let output_path = output_dir.join(filename);

        let mut output = File::create(&output_path).map_err(|e| e.to_string())?;

        copy(&mut file, &mut output).map_err(|e| e.to_string())?;

        if NOVEL_EXTENSIONS.contains(&extension.as_str()) {
            pages.push(output_path.to_string_lossy().to_string());
        } else if (EXTENSIONS).contains(&extension.as_str()) {
            images.push(output_path.to_string_lossy().to_string());
        }
    }
    images.sort();
    pages.sort();

    let cover_location = images.first().ok_or("Manga contains no images")?.clone();

    let thumbnail_path = thumbnail_dir.join("cover.webp");

    let image = ImageReader::open(&cover_location)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    let thumbnail = image.thumbnail(240, 360); // low quality cuz you cant really tell  + optimized

    thumbnail.save(&thumbnail_path).map_err(|e| e.to_string())?;

    let cnf: std::path::PathBuf = output_dir.join("meta.json");

    let metadata = BookMetadata::default();

    let pagething = if novel { pages.clone() } else { images.clone() };
    let manga = Book::new(
        BookType::Novel,
        output_dir,
        cover_location,
        pagething,
        metadata,
    );

    let json = serde_json::to_string_pretty(&manga).map_err(|e| e.to_string())?;

    std::fs::write(&cnf, json).map_err(|e| e.to_string())?;

    Ok(images)
}

#[tauri::command]
pub fn get_manga_list(app: AppHandle) -> Result<Vec<Book>, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("manga");

    let entries = std::fs::read_dir(&data_dir).map_err(|e| e.to_string())?;

    println!("{:?}", entries);

    let paths = entries
        .filter_map(|entry| entry.ok())
        .filter_map(|entry| {
            entry
                .path()
                .file_name()
                .and_then(|path| path.to_str())
                .map(String::from)
        })
        .collect::<Vec<String>>();

    let manga_list: Vec<Book> = paths
        .iter()
        .filter_map(|manga| {
            let location = data_dir
                .join(manga.clone())
                .join("meta.json")
                .to_str()?
                .to_string();
            let data = std::fs::read(location).ok()?;

            serde_json::from_slice(&data).ok()
        })
        .collect();
    println!("{:?}", manga_list);
    Ok(manga_list)
}

#[tauri::command]
pub fn get_manga(path: &str) -> Result<Book, String> {
    let path = Path::new(path).join("meta.json");
    println!("{:?}", path);
    let entry = std::fs::read(path).map_err(|e| e.to_string())?;

    let data: Book = serde_json::from_slice(&entry).map_err(|e| e.to_string())?;

    Ok(data)
}

#[tauri::command]
pub fn favorite_manga(path: &str) -> Result<Book, String> {
    let path = Path::new(path).join("meta.json");
    println!("{:?}", path);
    let entry = std::fs::read(&path).map_err(|e| e.to_string())?;

    let mut data: Book = serde_json::from_slice(&entry).map_err(|e| e.to_string())?;

    data.favorite = !data.favorite;

    let json = serde_json::to_string_pretty(&data).map_err(|e| e.to_string())?;

    std::fs::write(&path, json).map_err(|e| e.to_string())?;

    println!("Set favorite status to: {:?}", data);

    Ok(data)
}
