<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { page } from "$app/state";
	import type { Book } from "$lib/types/LibraryManga";
	import { load_novel_page, novel_class, set_rpc } from "$lib/constants/util";

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

	function handle_press(e: MouseEvent & { currentTarget: HTMLDivElement }) {
		if (e.button !== 0) return;

		const rect = e.currentTarget.getBoundingClientRect();
		const in_left_half = e.clientX - rect.left < rect.width / 2;

		go(in_left_half ? -1 : 1);
	}

	$effect(() => {
		set_rpc(
			data.metadata.title,
			`Reading • Page ${current_page + 1} / ${total}`,
		);
	});

	let leftSrc = $state("");

	async function update_pages(first: string | undefined) {
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
				void update_pages(first);
			});
		} else {
			leftSrc = second ? convertFileSrc(second) : "";
		}
	});
</script>

<div
	role="presentation"
	onmousedown={handle_press}
	class="flex h-full w-full min-h-0 min-w-0 cursor-pointer flex-col gap-2 text-primary-text {is_novel
		? ''
		: 'select-none'}"
>
	<div class="flex min-h-0 min-w-0 flex-1 gap-3">
		{#if is_novel}
			<div class={novel_class}>
				{@html leftSrc}
			</div>
		{:else}
			<div
				class="relative flex min-h-0 min-w-0 flex-1 items-center justify-center"
			>
				<img
					alt="Page {current_page + 1}"
					src={leftSrc}
					class="max-h-full max-w-full rounded object-contain pointer-events-none"
				/>
			</div>
		{/if}
	</div>

	<div
		class="flex shrink-0 items-center justify-between gap-3 border-t border-primary-text/10 pt-2"
	>
		<span class="min-w-0 truncate text-xs text-primary-text/50">
			{data.metadata.title}
		</span>

		<span
			class="min-w-24 text-center text-xs tabular-nums text-primary-text/50"
		>
			{current_page} / {total}
		</span>
	</div>
</div>
