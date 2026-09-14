use std::fs::{create_dir_all, File};
use std::io::{copy, Write};
use std::path::Path;

use tauri::{AppHandle, Manager};

use crate::models::manga::Manga;

#[tauri::command]
pub fn read_manga(app: AppHandle, path: &str, name: &str) -> Result<Vec<String>, String> {
    let file = File::open(path).map_err(|e| e.to_string())?;

    let mut archive: zip::ZipArchive<File> =
        zip::ZipArchive::new(file).map_err(|e| e.to_string())?;

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

    let cnf = &output_dir.join("meta.json");
    File::create(&cnf).map_err(|e| e.to_string())?;

    images.sort();

    let cover_location = images.first().unwrap().clone();

    let manga = Manga {
        cover_location,
        location: output_dir.to_string_lossy().to_string(),
        pages: images.clone(),
        current_page: 0,
    };

    let json = serde_json::to_string_pretty(&manga).map_err(|e| e.to_string())?;

    std::fs::write(&cnf, json).map_err(|e| e.to_string())?;

    Ok(images)
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
