<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { page } from "$app/state";
	import type { Book } from "$lib/types/LibraryManga";
	import {
		gutter_class,
		load_novel_page,
		novel_class,
		set_rpc,
	} from "$lib/constants/util";
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";

	const params = new URLSearchParams(page.url.search);
	const book: string | null = params.get("book");

	const data: Book = await invoke("get_manga", { path: book });
	const is_novel = data.book_type === "Novel";
	const step = 1;
	const total = data.pages.length;

	let current_page = $state(0);

	function go(delta: number) {
		const max = Math.max(total - 1, 0);

		current_page = Math.min(Math.max(current_page + delta * step, 0), max);
	}

	const can_prev = $derived(current_page > 0);
	const can_next = $derived(current_page < total - 1);
	const last_visible = $derived(Math.min(current_page + step, total));

	$effect(() => {
		set_rpc(
			data.metadata.title,
			`Reading • Page ${current_page + 1} / ${total}`,
		);
	});

	let leftSrc = $state("");

	async function update_pages(
		first: string | undefined,
		second: string | undefined,
	) {
		leftSrc = "";

		if (is_novel) {
			leftSrc = first ? await load_novel_page(first) : "";
		}
	}

	$effect(() => {
		const first = data.pages[current_page];
		const second = data.pages[current_page + 1];

		leftSrc = "";

		if (is_novel) {
			queueMicrotask(() => {
				void update_pages(first, second);
			});
		} else {
			leftSrc = second ? convertFileSrc(second) : "";
		}
	});
</script>

<div
	class="flex h-full w-full min-h-0 min-w-0 flex-col gap-2 text-primary-text"
>
	<div
		class="flex min-h-0 min-w-0 flex-1 gap-3 overflow-x-hidden overflow-y-auto"
	>
		{#if is_novel}
			<button
				onclick={() => go(-1)}
				disabled={!can_prev}
				aria-label="Previous page"
				tabindex="-1"
				class={gutter_class}
			>
				{#if can_prev}
					<ChevronLeft
						class="size-5 text-primary-text/50 opacity-0 group-hover:opacity-100"
					/>
				{/if}
			</button>
			<div class={novel_class}>
				{@html leftSrc}
			</div>

			<button
				onclick={() => go(1)}
				disabled={!can_next}
				aria-label="Next page"
				tabindex="-1"
				class={gutter_class}
			>
				{#if can_next}
					<ChevronRight
						class="size-5 text-primary-text/50 opacity-0 group-hover:opacity-100"
					/>
				{/if}
			</button>
		{:else}
			<button
				onclick={() => go(-1)}
				disabled={!can_prev}
				aria-label="Previous page"
				tabindex="-1"
				class={gutter_class}
			>
				{#if can_prev}
					<ChevronLeft
						class="size-5 text-primary-text/50 opacity-0 group-hover:opacity-100"
					/>
				{/if}
			</button>

			<div
				class="relative flex min-h-0 min-w-0 flex-1 items-center justify-center"
			>
				<img
					alt="Page {current_page + 1}"
					src={leftSrc}
					class="block max-h-full max-w-full rounded object-contain pointer-events-none"
				/>

				<button
					onclick={() => go(-1)}
					disabled={!can_prev}
					aria-label="Previous page"
					class="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
				></button>

				<button
					onclick={() => go(1)}
					disabled={!can_next}
					aria-label="Next page"
					class="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
				></button>
			</div>

			<button
				onclick={() => go(1)}
				disabled={!can_next}
				aria-label="Next page"
				tabindex="-1"
				class={gutter_class}
			>
				{#if can_next}
					<ChevronRight
						class="size-5 text-primary-text/50 opacity-0 group-hover:opacity-100"
					/>
				{/if}
			</button>
		{/if}
	</div>

	<div
		class="flex shrink-0 items-center justify-between gap-3 border-t border-primary-text/10 pt-2"
	>
		<span class="min-w-0 truncate text-xs text-primary-text/50">
			{data.metadata.title}
		</span>

		<div class="flex shrink-0 items-center gap-1">
			<button
				onclick={() => go(1)}
				disabled={!can_next}
				aria-label="Next pages"
				class="flex size-7 items-center justify-center rounded hover:bg-primary-text/10 disabled:opacity-30 disabled:hover:bg-transparent"
			>
				<ChevronLeft class="size-4" />
			</button>

			<span
				class="min-w-24 text-center text-xs tabular-nums text-primary-text/50"
			>
				{current_page} / {total}
			</span>

			<button
				onclick={() => go(-1)}
				disabled={!can_prev}
				aria-label="Previous pages"
				class="flex size-7 items-center justify-center rounded hover:bg-primary-text/10 disabled:opacity-30 disabled:hover:bg-transparent"
			>
				<ChevronRight class="size-4" />
			</button>
		</div>
	</div>
</div>
