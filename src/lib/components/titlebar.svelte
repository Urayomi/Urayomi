<script>
	// OLD CODE WILL GET REFACTORED SOON
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import FillSpace from "./common/fill_space.svelte";
	import { Bookmark, EyeIcon, EyeOff, Plus } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import Button from "./common/button.svelte";
	import { selectFile } from "$lib/constants/util";
	import { sidebarState } from "./states/sidebar.svelte";

	const appWindow = getCurrentWindow();

	async function minimize() {
		await appWindow.minimize();
	}

	async function toggleMaximize() {
		await appWindow.toggleMaximize();
	}

	async function close() {
		await appWindow.close();
	}
</script>

<header
	data-tauri-drag-region
	class="titlebar flex flex-row items-center w-full h-9 bg-surface select-none"
>
	<div class="flex items-center h-full">
		<div class="flex items-center gap-2 px-3 select-none pointer-events-none">
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

			<span
				class="text-[10px] font-black tracking-[0.2em] uppercase text-primary-text"
			>
				Urayomi
			</span>
		</div>
	</div>

	<div
		class="h-full color flex items-center justify-center text-primary-text/90 gap-3"
	>
		<Button Text={Plus} onclick={selectFile} class="" expand={false} />
		<Button
			Text={sidebarState.hidden ? EyeIcon : EyeOff}
			label="hide"
			onclick={() => (sidebarState.hidden = !sidebarState.hidden)}
			expand={false}
		/>
	</div>

	<FillSpace />

	<div class="flex h-full">
		<button
			class="inline-flex items-center justify-center w-11 h-full text-gray-400 hover:text-white hover:bg-white/10"
			title="Minimize"
			on:click={minimize}
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
			on:click={toggleMaximize}
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
			on:click={close}
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
