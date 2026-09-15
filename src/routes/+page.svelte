<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";
	import type { LibraryManga } from "../lib/types/LibraryManga";

	const MATCH = /[^/\\]+(?=\.[^.]+$|$)/;
	let manga_list: LibraryManga[] = $state(await invoke("get_manga_list"));

	async function selectFile() {
		const paths: string[] | null = await open({
			multiple: true,
			directory: false,
			filters: [
				{
					name: "Image",
					extensions: ["zip", "epub", "cbz"],
				},
			],
		});

		if (!paths?.length) return;

		for (let path of paths) {
			console.log(path);
			let cleaned_path = path?.match(MATCH)?.[0] || "unknown";
			console.log(cleaned_path);
			await invoke("read_manga", { path, name: cleaned_path });
		}

		manga_list = await invoke("get_manga_list");
	}
</script>

<main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 pr-5">
		{#each manga_list as manga}
			<div class="min-w-0">
				<img
					alt={manga.location}
					src={convertFileSrc(manga.cover_location)}
					class="aspect-2/3 w-full rounded object-cover"
				/>
			</div>
		{/each}
	</div>
</main>
