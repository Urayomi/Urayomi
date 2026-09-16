import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export const MATCH = /[^/\\]+(?=\.[^.]+$|$)/;

export async function selectFile() {
	const paths: string[] | null = await open({
		multiple: true,
		directory: false,
		filters: [
			{
				name: "Image",
				// extensions: ["zip", "epub", "cbz"], // removed for now until i confirm if all manga is contained within this
				extensions: [],
			},
		],
	});

	if (!paths?.length) return;

	for (let path of paths) {
		// goes through each selection so uploading is easier.
		// console.log(path);
		let parsed = path?.match(MATCH)?.[0] || "unknown";
		// console.log(cleaned_path);
		await invoke("read_manga", { path, name: parsed });
	}
}
