<script lang="ts">
	import { sidebarState } from "$lib/components/states/sidebar.svelte";
	import Sidebar from "../lib/components/sidebar.svelte";
	import Titlebar from "../lib/components/titlebar.svelte";
	import "./layout.css";
	const { children } = $props();
</script>

<main class="flex w-screen h-screen">
	{#if !sidebarState.hidden}
		<Sidebar />
	{/if}
	<div class="flex flex-1 min-h-0 min-w-0 bg-surface flex-col">
		<Titlebar />

		<div
			class="bg-background min-h-0 min-w-0 flex flex-1 rounded-tl-2xl p-2 overflow-scroll"
		>
			{@render children()}
		</div>
	</div>
</main>
