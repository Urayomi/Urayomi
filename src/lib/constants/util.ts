import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { setActivity } from "tauri-plugin-drpc";
import { Activity, Timestamps } from "tauri-plugin-drpc/activity";

export const MATCH = /[^/\\]+(?=\.[^.]+$|$)/;
export const NAME_MATCH = new RegExp(
	"[^/\\\\]+?(?=\\.[^.]+$|\\(|\\[|\\s-\\s|$)",
);

export async function selectFile() {
	const paths: string[] | null = await open({
		multiple: true,
		directory: false,
		filters: [
			{
				name: "Image",
				extensions: ["zip", "epub", "cbz"], // removed for now until i confirm if all manga is contained within this
				// extensions: [],
			},
		],
	});

	if (!paths?.length) return;

	for (let path of paths) {
		// goes through each selection so uploading is easier.
		// console.log(path);
		let parsed = path?.match(MATCH)?.[0] || "unknown";
		let mangaName = path?.match(NAME_MATCH)?.[0] || "unknown";
		// console.log(cleaned_path);
		await invoke("read_manga", { path, name: parsed, mangaName });
	}
}

export async function set_rpc(
	details: string = "",
	state: string = "",
	important: boolean = false,
) {
	const activity = new Activity()
		.setDetails(details)
		.setState(state)
		.setTimestamps(new Timestamps(Date.now()));

	await setActivity(activity);
}
