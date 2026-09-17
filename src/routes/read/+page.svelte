<script lang="ts">
	import { page } from "$app/state";
	import { invoke } from "@tauri-apps/api/core";
	const params = new URLSearchParams(page.url.search);

	const book: string | null = params.get("book");

	console.log(params.get("book"));
	const data = await invoke("get_manga", { path: book });
	console.log(data);
</script>

{book}
<div></div>
