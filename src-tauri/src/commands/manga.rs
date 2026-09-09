use std::fs::{create_dir_all, File};
use std::io::copy;
use std::path::Path;

use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn read_manga(
    app: AppHandle,
    path: &str,
    name: &str,
) -> Result<Vec<String>, String> {
    let file = File::open(path)
        .map_err(|e| e.to_string())?;

    let mut archive = zip::ZipArchive::new(file)
        .map_err(|e| e.to_string())?;

    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let output_dir = data_dir.join(name);

    create_dir_all(&output_dir)
        .map_err(|e| e.to_string())?;

    let mut images = Vec::new();

    for i in 0..archive.len() {                                                                                                                                                                                                                                                                                           
        let mut file = archive
            .by_index(i)
            .map_err(|e| e.to_string())?;

        let name = file.name().to_string();

        let filename = Path::new(&name)
            .file_name()
            .ok_or("Invalid filename")?;
        
        let output_path = output_dir.join(filename);

        let mut output = File::create(&output_path)
            .map_err(|e| e.to_string())?;

        copy(&mut file, &mut output)
            .map_err(|e| e.to_string())?;

        images.push(output_path.to_string_lossy().to_string());
    }

    Ok(images)
}