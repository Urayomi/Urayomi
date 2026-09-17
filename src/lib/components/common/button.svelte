<script>
	import { sidebarState } from "../states/sidebar.svelte";

	let {
		Text,
		label = "",
		onclick,
		class: className = "",
		expand = true,
	} = $props();
</script>

<button
	class="
		relative flex items-center rounded
		hover:bg-primary-text/10 gap-3
		{sidebarState.expanded && expand ? 'w-40' : 'w-fit'}
		overflow-hidden
		{className}        
	"
	{onclick}
>
	<Text strokeWidth={1.3} />

	{#if sidebarState.expanded && expand}
		<span
			class="
				{sidebarState.expanded && expand
				? 'opacity-100 translate-x-0'
				: 'opacity-0 -translate-x-2'}
			"
		>
			{label}
		</span>
	{/if}
</button>
