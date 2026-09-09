<script lang="ts">
	import { invoke, convertFileSrc } from "@tauri-apps/api/core";
	import { open } from "@tauri-apps/plugin-dialog";

	let abc = $state<string[]>([]);

	async function selectFile() {
		const path = await open({
			multiple: false,
			directory: false,
			filters: [
				{
					name: "Image",
					extensions: ["zip", "epub", "cbz"],
				},
			],
		});

		if (!path) return;

		const data = await invoke("read_manga", { path, name: "placeholder" });
		console.log(data);
		abc = data as string[];
	}
</script>

<main class="container">
	<button onclick={selectFile}>{abc[0]} asd</button>
	<img alt="image1" src={convertFileSrc(abc[0])} />
</main>
