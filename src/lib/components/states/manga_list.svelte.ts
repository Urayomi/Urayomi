import type { LibraryManga } from "$lib/types/LibraryManga";
import { open } from "@tauri-apps/plugin-dialog";

export const mangaStates = $state({
	manga_list: [] as LibraryManga[],
});
