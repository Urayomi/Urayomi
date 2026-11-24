import { mangaStates } from "$lib/components/states/manga_list.svelte";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { setActivity, start } from "tauri-plugin-drpc";
import { Activity, Assets, Timestamps } from "tauri-plugin-drpc/activity";

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
		let manga_name = path?.match(NAME_MATCH)?.[0] || "unknown";
		// console.log(cleaned_path);
		let EXPERIMENTAL_IMPORT_AS_NOVEL = false;
		// prompt("import as novel? Y/n", "y")?.toLowerCase() == "y";
		console.log(`manga name is ${manga_name}`);
		await invoke("process_manga", {
			path,
			name: parsed,
			mangaName: manga_name,
			novel: EXPERIMENTAL_IMPORT_AS_NOVEL,
		});
	}
}
let rpc_ready: Promise<boolean> | null = null;

export function init_rpc() {
	rpc_ready ??= start("1385376580691427440")
		.then(() => true)
		.catch((e) => {
			console.error("failed to start discord rpc:", e);
			return false;
		});
	return rpc_ready;
}

export async function set_rpc(title: string, state: string) {
	if (!(await rpc_ready)) return;

	try {
		const activity = new Activity()
			.setDetails(title)
			.setState(state)
			.setTimestamps(new Timestamps(Math.floor(Date.now() / 1000)))
			.setAssets(new Assets().setLargeImage("logo"));

		await setActivity(activity);
	} catch (e) {
		console.error("failed to set discord rpc activity:", e);
	}
}
export const novel_class =
	"w-full max-w-3xl min-w-0 min-h-0 overflow-auto px-4 text-sm leading-relaxed " +
	"[&_p]:mb-3 [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold " +
	"[&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold " +
	"[&_img]:mx-auto [&_img]:my-3 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full";

export const gutter_class =
	"group flex min-w-10 flex-1 basis-0 items-center justify-center rounded " +
	"enabled:cursor-pointer enabled:hover:bg-primary-text/10 disabled:cursor-default";

export function to_asset_url(ref: string, dir: string): string {
	if (!ref || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(ref)) return ref;
	const base = new URL(
		"file:///" + dir.replace(/\\/g, "/").replace(/^\/+/, ""),
	);
	const path = decodeURIComponent(new URL(ref, base).pathname);
	return convertFileSrc(/^\/[a-z]:/i.test(path) ? path.slice(1) : path);
}

export function prepare_novel(html: string, page_path: string): string {
	const dir = page_path.slice(
		0,
		Math.max(page_path.lastIndexOf("/"), page_path.lastIndexOf("\\")) + 1,
	);
	const body = new DOMParser().parseFromString(html, "text/html").body;

	body.querySelectorAll("script, style, link").forEach((el) => el.remove());
	body.querySelectorAll("a").forEach((a) => a.removeAttribute("href"));

	body.querySelectorAll("img[src]").forEach((img) => {
		img.setAttribute("src", to_asset_url(img.getAttribute("src") ?? "", dir));
	});
	body.querySelectorAll("image").forEach((img) => {
		for (const attr of ["href", "xlink:href"]) {
			const value = img.getAttribute(attr);
			if (value) img.setAttribute(attr, to_asset_url(value, dir));
		}
	});

	return body.innerHTML;
}

export async function load_novel_page(
	path: string | undefined,
): Promise<string> {
	if (!path) return "";
	const html: string = await invoke("get_novel_page", { path });
	return prepare_novel(html, path);
}

export async function favorite_manga(path: string) {
	await invoke("favorite_manga", { path });
	mangaStates.manga_list = await invoke("get_manga_list");
}
