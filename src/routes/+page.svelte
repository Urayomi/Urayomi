<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import type { LibraryManga } from "../lib/types/LibraryManga";

	const MATCH = new RegExp("[^/\\\\]+?(?=\\.[^.]+$|\\(|\\[|\\s-\\s|$)");

	let manga_list: LibraryManga[] = $state(await invoke("get_manga_list"));

	async function selectFile() {
		const path: string | null = await open({
			multiple: false,
			directory: false,
			filters: [
				{
					name: "Image",
					extensions: ["zip", "epub", "cbz"],
				},
			],
		});

		if (!path) return;

		let cleaned_path = path?.match(MATCH)?.[0] || "unknown";
		await invoke("read_manga", { path, name: cleaned_path });

		manga_list = await invoke("get_manga_list");
	}
</script>

<main class="container w-full h-full">
	<button onclick={selectFile}>aasdasdasdsd</button>

	<div class="flex gap-2">
		{#each manga_list as manga}
			<img
				alt="image1"
				src={convertFileSrc(manga.cover_location)}
				class="w-1/3 rounded"
			/>
		{/each}
	</div>
</main>
