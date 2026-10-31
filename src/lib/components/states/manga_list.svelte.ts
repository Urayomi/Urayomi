import type { Book, LibraryManga } from "$lib/types/LibraryManga";
import { open } from "@tauri-apps/plugin-dialog";

export const mangaStates = $state({
	manga_list: [] as Book[],
});
