<script lang="ts">
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { convertFileSrc } from "@tauri-apps/api/core";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { EyeIcon, EyeOff, Plus, X } from "@lucide/svelte";
	import FillSpace from "./common/fill_space.svelte";
	import Button from "./common/button.svelte";
	import { selectFile } from "$lib/constants/util";
	import { sidebarState } from "./states/sidebar.svelte";
	import { close_tab, tabsState } from "./states/tabs.svelte";

	const appWindow = getCurrentWindow();

	const active_key = $derived(
		page.url.pathname === "/read" ? page.url.searchParams.get("book") : null,
	);

	let strip: HTMLDivElement | null = $state(null);

	$effect(() => {
		if (!active_key) return;

		// highlight the active tab and scroll it into view
		strip
			?.querySelector('[data-active="true"]')
			?.scrollIntoView({ block: "nearest", inline: "nearest" });
	});

	function on_close(key: string) {
		const was_active = active_key === key;
		const next = close_tab(key);

		if (!was_active) return;

		goto(next ? `/read?book=${encodeURIComponent(next.key)}` : "/");
	}

	async function minimize() {
		await appWindow.minimize();
	}

	async function toggleMaximize() {
		await appWindow.toggleMaximize();
	}

	async function close_window() {
		await appWindow.close();
	}
</script>

<header
	data-tauri-drag-region="deep"
	class="titlebar flex flex-row items-center w-full h-9 bg-surface select-none text-primary-text/90"
>
	<div class="flex items-center h-full shrink-0">
		<button
			class="flex items-center gap-2 px-3 select-none cursor-pointer"
			onclick={() => goto("/")}
		>
			<svg width="18" height="18" viewBox="0 0 200 200" class="opacity-90">
				<rect
					x="20"
					y="20"
					width="160"
					height="160"
					rx="20"
					fill="none"
					class="stroke-primary-text"
					stroke-width="12"
				/>
				<text
					x="100"
					y="85"
					class="fill-primary-text"
					font-weight="900"
					font-size="50"
					text-anchor="middle">URA</text
				>
				<text
					x="100"
					y="145"
					class="fill-primary-text"
					font-weight="900"
					font-size="50"
					text-anchor="middle">YOMI</text
				>
			</svg>
		</button>
	</div>

	<div
		bind:this={strip}
		role="tablist"
		class="tabs flex h-full min-w-0 items-end gap-1 overflow-x-auto overflow-y-hidden"
	>
		{#each tabsState.tabs as tab (tab.key)}
			<div
				role="presentation"
				data-active={active_key === tab.key}
				class="group relative flex h-8 w-44 shrink-0 items-end"
			>
				<a
					role="tab"
					aria-selected={active_key === tab.key}
					href={`/read?book=${encodeURIComponent(tab.key)}`}
					title={tab.title}
					class="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-t-md pl-2 pr-7 text-xs transition-colors
						{
							active_key === tab.key
								? 'bg-background text-primary-text'
								: 'bg-primary-text/5 text-primary-text/70 hover:bg-primary-text/10 hover:text-primary-text'
						}"
				>
					{#if tab.cover}
						<img
							src={convertFileSrc(tab.cover)}
							alt=""
							class="size-4 shrink-0 rounded-sm object-cover"
						/>
					{/if}
					<span class="truncate">{tab.title}</span>
				</a>

				<button
					type="button"
					aria-label={`Close ${tab.title}`}
					onclick={() => on_close(tab.key)}
					class="absolute right-1 top-1.5 flex size-5 items-center justify-center rounded text-primary-text/50 transition
						hover:bg-primary-text/10 hover:text-primary-text
						{active_key === tab.key
						? 'opacity-100'
						: 'opacity-0 group-hover:opacity-100'}"
				>
					<X class="size-3" />
				</button>
			</div>
		{/each}
	</div>

	<Button
		Text={Plus}
		onclick={selectFile}
		class="ml-2 shrink-0"
		expand={false}
	/>

	<FillSpace />

	<Button
		Text={sidebarState.hidden ? EyeIcon : EyeOff}
		label="hide"
		onclick={() => (sidebarState.hidden = !sidebarState.hidden)}
		class="mx-1"
		expand={false}
	/>

	<div class="flex h-full shrink-0">
		<button
			class="inline-flex items-center justify-center w-11 h-full text-gray-400 hover:text-white hover:bg-white/10"
			title="Minimize"
			onclick={minimize}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M5 12h14" />
			</svg>
		</button>

		<button
			class="inline-flex items-center justify-center w-11 h-full text-gray-400 hover:text-white hover:bg-white/10"
			title="Maximize"
			onclick={toggleMaximize}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="5" y="5" width="14" height="14" rx="1" />
			</svg>
		</button>

		<button
			class="inline-flex items-center justify-center w-11 h-full text-gray-400 hover:text-white hover:bg-red-500/90"
			title="Close"
			onclick={close_window}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	</div>
</header>

<style>
	/* custom tiny scrollbar for the top bar tabs */
	.tabs::-webkit-scrollbar {
		height: 3px;
	}

	.tabs::-webkit-scrollbar-track {
		background: transparent;
	}

	.tabs::-webkit-scrollbar-thumb {
		background: rgb(245 245 245 / 0.25);
		border-radius: 9999px;
	}

	.tabs::-webkit-scrollbar-thumb:hover {
		background: rgb(245 245 245 / 0.4);
	}
</style>
