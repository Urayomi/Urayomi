<script>
	import { sidebarState } from "../states/sidebar.svelte";

	let { Text, label = "", onclick, class: className = "" } = $props();
</script>

<button
	class="
		relative flex items-center gap-3 rounded
		hover:bg-primary-text/10
		{sidebarState.expanded ? 'w-40' : 'w-fit'}
		overflow-hidden
		{className}
	"
	{onclick}
>
	<Text strokeWidth={1.3} />

	{#if sidebarState.expanded}
		<span
			class="
				{sidebarState.expanded
				? 'opacity-100 translate-x-0'
				: 'opacity-0 -translate-x-2'}
			"
		>
			{label}
		</span>
	{/if}
</button>
