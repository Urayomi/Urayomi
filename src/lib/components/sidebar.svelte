<script lang="ts">
	import { goto } from "$app/navigation";
	import {
		Bookmark,
		Clock,
		EyeOff,
		Library,
		Search,
		Settings,
	} from "@lucide/svelte";
	import { page } from "$app/state";

	import Seperator from "./common/seperator.svelte";
	import FillSpace from "./common/fill_space.svelte";
	import CenterHorizontal from "./common/center_horizontal.svelte";
	import { sidebarState } from "./states/sidebar.svelte";
	import Button from "./common/button.svelte";

	const isActive = (path: string) =>
		page.url.pathname === path ? "bg-primary-text/10" : "";
</script>

<div
	class="
		h-full bg-surface flex flex-col pt-2
		text-primary-text/90 gap-3 font-sans
		overflow-hidden
		transition-[width] duration-200
		{sidebarState.expanded ? 'w-48' : 'w-12'}
	"
>
	<div class="pl-3">
		<button
			title="menu"
			onclick={() => (sidebarState.expanded = !sidebarState.expanded)}
		>
			<svg
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6 cursor-pointer"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	</div>

	<CenterHorizontal><Seperator /></CenterHorizontal>

	<div class="flex flex-col gap-3 pl-2">
		<Button
			Text={Library}
			label="library"
			onclick={() => goto("/")}
			class="p-1 {isActive('/')}"
		/>

		<Button
			Text={Bookmark}
			label="bookmarks"
			onclick={() => goto("/bookmarks")}
			class="p-1 {isActive('/bookmarks')}"
		/>

		<Button
			Text={Clock}
			label="history"
			onclick={() => goto("/history")}
			class="p-1 {isActive('/history')}"
		/>

		<Button
			Text={Search}
			label="search"
			onclick={() => goto("/search")}
			class="p-1 {isActive('/search')}"
		/>
	</div>

	<FillSpace />

	<CenterHorizontal><Seperator /></CenterHorizontal>

	<div class="flex flex-col gap-5 mb-2 pl-2">
		<Button
			Text={Settings}
			label="settings"
			onclick={() => goto("/settings")}
			class="p-1 {isActive('settings')}"
		/>
	</div>
</div>
