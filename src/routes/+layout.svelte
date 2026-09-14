<script lang="ts">
	import Sidebar from "../lib/components/sidebar.svelte";
	import Titlebar from "../lib/components/titlebar.svelte";
	import "./layout.css";
	const { children } = $props();
</script>

<main class="flex w-screen h-screen">
	<Sidebar />
	<div class="flex flex-1 bg-surface flex-col">
		<Titlebar />

		<div class="bg-background flex-1 rounded-tl-2xl p-2">
			{@render children()}
		</div>
	</div>
</main>
