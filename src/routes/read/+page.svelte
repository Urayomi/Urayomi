<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";

	import { page } from "$app/state";
	import type { LibraryManga } from "$lib/types/LibraryManga";
	const params = new URLSearchParams(page.url.search);

	const book: string | null = params.get("book");

	console.log(params.get("book"));
	const data: LibraryManga = await invoke("get_manga", { path: book });
	console.log(data);
</script>

<div class="flex gap-3 w-full h-full">
	<img
		src={convertFileSrc(data.pages[0])}
		class="aspect-2/3 flex-1 rounded object-cover"
	/><img
		src={convertFileSrc(data.pages[0])}
		class="aspect-2/3 flex-1 rounded object-cover"
	/>
</div>
