<script lang="ts">
	import { convertFileSrc } from "@tauri-apps/api/core";
	import { goto } from "$app/navigation";
	import { Search, Star, X } from "@lucide/svelte";

	import { mangaStates } from "$lib/components/states/manga_list.svelte";
	import Manga from "$lib/components/common/manga.svelte";

	const filters = ["All", "Favorites", "Manga", "Novels"];

	let query = $state("");
	let filter = $state("All");
	let sort = $state("Default");
	let open = $state<string | null>(null);
	let input = $state<HTMLInputElement | null>(null);

	const file_name = (location: string) =>
		location.split(/[\\/]/).pop() ?? location;

	let index = $derived(
		mangaStates.manga_list.map((manga) => {
			const title = manga.metadata?.title ?? "";
			const file = file_name(manga.location);
			return {
				manga,
				text: `${title} ${file}`.toLowerCase(),
				name: (title || file).toLowerCase(),
			};
		}),
	);

	let terms = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));

	let results = $derived.by(() => {
		const list = index.filter(
			({ manga, text }) =>
				terms.every((term) => text.includes(term)) &&
				(filter === "All" ||
					(filter === "Favorites"
						? manga.favorite
						: filter === "Novels"
							? manga.book_type === "Novel"
							: manga.book_type !== "Novel")),
		);

		if (sort !== "Default") {
			list.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { numeric: true }),
			);
			if (sort === "Z to A") list.reverse();
		}

		return list.map(({ manga }) => manga);
	});

	$effect(() => {
		input?.focus();
	});

	function on_keydown(e: KeyboardEvent) {
		if (e.key === "Escape") {
			if (open) open = null;
			else if (query) query = "";
			else input?.blur();
			return;
		}

		const el = e.target;
		const typing =
			el instanceof HTMLElement &&
			(el.tagName === "INPUT" ||
				el.tagName === "SELECT" ||
				el.isContentEditable);

		if (e.key === "/" && !typing) {
			e.preventDefault();
			input?.focus();
		}
	}
</script>

<svelte:window
	onkeydown={on_keydown}
	onclick={(e) => {
		if (!(e.target instanceof Element) || !e.target.closest("[data-card]")) {
			open = null;
		}
	}}
/>

<main
	class="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto font-sans text-primary-text"
>
	<header class="mb-3 flex flex-wrap items-center gap-2">
		<div
			class="group flex h-8 min-w-0 max-w-sm flex-1 items-center gap-2 rounded border border-primary-text/10 bg-surface px-2.5 transition focus-within:border-primary-text/30"
		>
			<Search class="size-4 shrink-0 text-primary-text/50" />

			<input
				bind:this={input}
				type="text"
				bind:value={query}
				oninput={() => (open = null)}
				placeholder="Search your library..."
				aria-label="Search your library"
				class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-primary-text/50"
			/>

			{#if query}
				<button
					type="button"
					aria-label="Clear search"
					onclick={() => {
						query = "";
						open = null;
						input?.focus();
					}}
					class="shrink-0 text-primary-text/50 transition hover:text-primary-text"
				>
					<X class="size-4" />
				</button>
			{:else}
				<kbd
					class="hidden shrink-0 rounded border border-primary-text/10 px-1.5 text-[10px] text-primary-text/50 group-focus-within:hidden sm:block"
				>
					/
				</kbd>
			{/if}
		</div>

		<nav
			class="flex shrink-0 items-center gap-0.5 rounded border border-primary-text/10 bg-surface p-0.5"
		>
			{#each filters as option}
				<button
					type="button"
					aria-pressed={filter === option}
					onclick={() => {
						filter = option;
						open = null;
					}}
					class="rounded px-2.5 py-1 text-xs transition
                            {filter === option
						? 'bg-primary-text/10 text-primary-text'
						: 'text-primary-text/50 hover:text-primary-text'}"
				>
					{option}
				</button>
			{/each}
		</nav>

		<span class="ml-auto shrink-0 text-xs tabular-nums text-primary-text/50">
			{results.length === index.length
				? `${results.length} ${results.length === 1 ? "title" : "titles"}`
				: `${results.length} of ${index.length}`}
		</span>
	</header>

	<section>
		{#if results.length > 0}
			<div class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
				{#each results as manga (manga.location)}
					<Manga {manga} bind:open />
				{/each}
			</div>
		{:else}
			<div class="py-16 text-center">
				<p class="text-sm text-primary-text/50">
					{terms.length > 0
						? "No results found."
						: filter === "Favorites"
							? "No favorites yet."
							: filter === "All"
								? "Your library is empty."
								: `No ${filter.toLowerCase()} in your library.`}
				</p>

				{#if terms.length > 0}
					<button
						type="button"
						onclick={() => {
							query = "";
							input?.focus();
						}}
						class="mt-2 text-xs text-primary-text/50 underline underline-offset-4 transition hover:text-primary-text"
					>
						Clear search
					</button>
				{/if}
			</div>
		{/if}
	</section>
</main>
