<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";

	import { mangaStates } from "$lib/components/states/manga_list.svelte";

	mangaStates.manga_list = await invoke("get_manga_list");
</script>

<main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 pr-5">
		{#each mangaStates.manga_list as manga}
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
