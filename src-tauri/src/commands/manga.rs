use std::fs::{create_dir_all, File};
use std::io::copy;
use std::path::Path;

use serde::Serialize;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn read_manga(app: AppHandle, path: &str, name: &str) -> Result<Vec<String>, String> {
    let file = File::open(path).map_err(|e| e.to_string())?;

    let mut archive = zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    let output_dir = data_dir.join("manga").join(name);

    create_dir_all(&output_dir).map_err(|e| e.to_string())?;

    let mut images = Vec::new();

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| e.to_string())?;

        let name = file.name().to_string();

        let filename = Path::new(&name).file_name().ok_or("Invalid filename")?;

        let output_path = output_dir.join(filename);

        let mut output = File::create(&output_path).map_err(|e| e.to_string())?;

        copy(&mut file, &mut output).map_err(|e| e.to_string())?;

        images.push(output_path.to_string_lossy().to_string());
    }

    Ok(images)
}

#[derive(Default, Serialize)]
pub struct Manga {
    location: String,
    cover_location: String, // would usually be first picture in manga
    pages: Vec<String>,     // [location, location, location]
}

#[tauri::command]
pub fn get_manga_list(app: AppHandle) -> Result<Vec<Manga>, String> {
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

    let manga_list: Vec<Manga> = paths
        .iter()
        .filter_map(|manga| {
            let location = data_dir.join(manga.clone()).to_str()?.to_string();
            let mut pages: Vec<String> = std::fs::read_dir(&location)
                .unwrap()
                .into_iter()
                .filter_map(|f| f.ok())
                .map(|f| f.path().to_string_lossy().into_owned())
                .collect();
            pages.sort();

            let cover_location = pages.clone().first().unwrap().to_string();

            Some(Manga {
                location,
                cover_location,
                pages,
            })
        })
        .collect();

    Ok(manga_list)
}
