<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { page } from "$app/state";
	import type { Book } from "$lib/types/LibraryManga";
	import { set_rpc } from "$lib/constants/util";
	import Button from "$lib/components/common/button.svelte";

	const params = new URLSearchParams(page.url.search);
	const book: string | null = params.get("book");

	const data: Book = await invoke("get_manga", { path: book });
	const is_novel = data.book_type == "Novel";
	const step = 2;

	function go(delta: number) {
		const max = Math.max(data.pages.length - 1, 0);
		current_page = Math.min(Math.max(current_page + delta * step, 0), max);
	}

	let current_page = $state(0);

	$effect(() => {
		console.log(data.metadata.title);
		set_rpc(
			data.metadata.title,
			`Reading • Page ${current_page + 1} / ${data.pages.length}`,
		);
		console.log("setting status duh");
	});

	let leftSrc = $state("");
	let rightSrc = $state("");

	async function update_pages(left: string, right: string) {
		leftSrc = await invoke("get_novel_page", { path: left });
		rightSrc = await invoke("get_novel_page", { path: right });
	}
	$effect(() => {
		current_page = Math.max(current_page, 0);
		const left = data.pages[current_page];
		const right = data.pages[current_page + 1];
		console.log(current_page);

		leftSrc = "";
		rightSrc = "";

		queueMicrotask(() => {
			if (is_novel) update_pages(left, right);
			else {
				leftSrc = left ? convertFileSrc(left) : "";
				rightSrc = right ? convertFileSrc(right) : "";
			}
		});
	});
</script>

<div class="flex gap-3 w-full h-full text-primary-text">
	{#if is_novel}
		<div class="flex-1 min-w-0 min-h-0 overflow-scroll">
			<button onclick={() => go(-1)}>
				{@html leftSrc}
			</button>
		</div>

		<div class="flex-1 min-w-0 min-h-0 overflow-scroll">
			<button onclick={() => (current_page += 2)}>
				{@html rightSrc}
			</button>
		</div>
	{:else}
		<button
			onclick={() => go(-1)}
			class="flex-1 min-w-0 min-h-0 overflow-hidden"
		>
			<img
				alt="page {current_page}"
				src={leftSrc}
				class="w-full h-full rounded object-contain"
			/>
		</button>

		<button
			onclick={() => go(1)}
			class="flex-1 min-w-0 min-h-0 overflow-hidden"
		>
			<img
				alt="page {current_page + 2}"
				src={rightSrc}
				class="w-full h-full rounded object-contain"
			/>
		</button>
	{/if}
</div>
