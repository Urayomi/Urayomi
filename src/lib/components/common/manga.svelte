<script lang="ts">
	import { goto } from "$app/navigation";
	import { favorite_manga } from "$lib/constants/util";
	import { Star } from "@lucide/svelte";
	import { convertFileSrc } from "@tauri-apps/api/core";

	let {
		manga,
		open = $bindable(),
	}: {
		manga: { location: string; cover_location: string; favorite: boolean };
		open: string | null;
	} = $props();
</script>

<div
	data-card
	class="relative min-w-0 [content-visibility:auto] [contain-intrinsic-size:auto_360px]"
>
	<button
		class="w-full"
		onclick={() => (open = open === manga.location ? null : manga.location)}
	>
		<img
			alt={manga.location}
			src={convertFileSrc(manga.cover_location)}
			loading="lazy"
			decoding="async"
			class="aspect-2/3 w-full rounded object-cover"
		/>
	</button>

	{#if open === manga.location}
		<div
			class="absolute inset-x-2 bottom-2 z-20 flex flex-col gap-2 rounded border border-primary-text/10 bg-surface p-2 text-sm shadow-lg"
		>
			<div class="flex items-start justify-between gap-2">
				<h2
					class="line-clamp-2 min-w-0 flex-1 break-all text-xs font-medium text-primary-text"
				>
					{manga.location.split(/[\\/]/).pop() ?? manga.location}
				</h2>

				<button
					type="button"
					aria-label={manga.favorite
						? "Remove from favorites"
						: "Add to favorites"}
					aria-pressed={manga.favorite}
					onclick={() => favorite_manga(manga.location)}
					class="flex size-8 shrink-0 items-center justify-center rounded bg-primary-text/10 transition hover:bg-primary-text/20"
				>
					<Star
						class={`size-4 ${manga.favorite ? "fill-yellow-400 text-yellow-400" : "text-primary-text"}`}
						strokeWidth={2}
					/>
				</button>
			</div>

			<p class="line-clamp-1 break-all text-[10px] text-primary-text/50">
				{manga.location}
			</p>

			<button
				type="button"
				onclick={() => goto(`/read?book=${encodeURIComponent(manga.location)}`)}
				class="rounded bg-primary-text/10 py-1.5 text-xs font-medium text-primary-text transition hover:bg-primary-text/20"
			>
				Read
			</button>
		</div>
	{/if}
</div>
