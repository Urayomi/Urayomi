<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";

	import { mangaStates } from "$lib/components/states/manga_list.svelte";
	import { goto } from "$app/navigation";

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
			<div data-card class="relative min-w-0">
				<button
					class="w-full"
					onclick={() =>
						(open = open === manga.location ? null : manga.location)}
				>
					<img
						alt={manga.location}
						src={convertFileSrc(manga.cover_location)}
						class="aspect-2/3 w-full rounded object-cover"
					/>
				</button>

				{#if open === manga.location}
					<div
						role="dialog"
						class="absolute inset-x-2 bottom-2 flex flex-col gap-2 rounded-lg bg-neutral-900/95 p-3 text-sm text-neutral-100 shadow-lg"
					>
						<h2 class="line-clamp-1 font-semibold">
							{manga.location.split(/[\\/]/).pop()}
						</h2>
						<p class="line-clamp-1 text-xs break-all text-neutral-400">
							{manga.location}
						</p>
						<button
							onclick={() => goto(`/read?book=${manga.location}`)}
							class="rounded bg-white py-1.5 font-medium text-neutral-900 hover:bg-neutral-200"
						>
							Read
						</button>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</main>
