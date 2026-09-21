<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { page } from "$app/state";
	import type { LibraryManga } from "$lib/types/LibraryManga";
	import { MATCH, set_rpc } from "$lib/constants/util";

	const params = new URLSearchParams(page.url.search);
	const book: string | null = params.get("book");

	const data: LibraryManga = await invoke("get_manga", { path: book });

	let current_page = $state(0);

	$effect(() => {
		set_rpc(
			data.name,
			`Reading • Page ${current_page + 1} / ${data.pages.length}`,
		);
	});

	let leftSrc = $state("");
	let rightSrc = $state("");

	$effect(() => {
		const left = data.pages[current_page];
		const right = data.pages[current_page + 1];

		leftSrc = "";
		rightSrc = "";

		queueMicrotask(() => {
			leftSrc = convertFileSrc(left);
			rightSrc = convertFileSrc(right);
		});
	});
</script>

<div class="flex gap-3 w-full h-full">
	<button
		onclick={() => current_page--}
		class="flex-1 min-w-0 min-h-0 overflow-hidden"
	>
		<img
			alt="page {current_page}"
			src={leftSrc}
			class="w-full h-full rounded object-contain"
		/>
	</button>

	<button
		onclick={() => current_page++}
		class="flex-1 min-w-0 min-h-0 overflow-hidden"
	>
		<img
			alt="page {current_page + 1}"
			src={rightSrc}
			class="w-full h-full rounded object-contain"
		/>
	</button>
</div>
