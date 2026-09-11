<script>
	export let Text;
	export let label = "";
	export let expand = false;
	export let onclick = () => {};
</script>

<button
	class="relative flex items-center gap-3 p-1 rounded
        hover:bg-primary-text/10
        {expand ? 'w-40' : 'w-fit'} overflow-hidden"
	{onclick}
>
	<Text strokeWidth={1.3} />

	{#if expand}
		<span
			class="
		{expand ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
	"
		>
			{label}
		</span>
	{/if}
</button>
