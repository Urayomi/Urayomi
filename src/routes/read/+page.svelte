<script lang="ts">
	import { page } from "$app/state";
	import Reader from "./reader.svelte";

	// when the book changes, re-render
	const book = $derived(page.url.searchParams.get("book"));
</script>

{#if book}
	{#key book}
		<Reader {book} />
	{/key}
{/if}
