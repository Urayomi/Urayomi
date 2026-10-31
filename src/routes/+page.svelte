<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";

	import { mangaStates } from "$lib/components/states/manga_list.svelte";
	import { goto } from "$app/navigation";
	import { BookOpen, Star } from "@lucide/svelte";
	import Manga from "$lib/components/common/manga.svelte";

	mangaStates.manga_list = await invoke("get_manga_list");

	let open = $state<string | null>(null);
</script>

<svelte:window
	onclick={(e) => {
		if (!(e.target as Element).closest("[data-card]")) open = null;
	}}
/>

<main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
	<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 pr-5">
		{#each mangaStates.manga_list as manga}
			<Manga {manga} bind:open />
		{/each}
	</div>
</main>
