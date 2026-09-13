<script lang="ts">
	import { goto } from "$app/navigation";
	import { Bookmark, Clock, Search, Settings } from "@lucide/svelte";

	import Seperator from "./common/seperator.svelte";
	import FillSpace from "./common/fill_space.svelte";
	import Button from "./common/button.svelte";
	import CenterHorizontal from "./common/center_horizontal.svelte";

	let expand = $state(false);
</script>

<div
	class="
		h-full bg-surface flex flex-col pt-2
		text-primary-text/90 gap-5 font-sans
		overflow-hidden pl-2
		transition-[width] duration-200
		{expand ? 'w-48' : 'w-12'}
	"
>
	<div class="pl-1">
		<button title="menu" onclick={() => (expand = !expand)}>
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

	<CenterHorizontal Child={Seperator} />

	<div class="flex flex-col gap-3">
		<Button
			Text={Bookmark}
			label="bookmarks"
			{expand}
			onclick={() => goto("/")}
		/>

		<Button
			Text={Clock}
			label="history"
			{expand}
			onclick={() => goto("/history")}
		/>

		<Button
			Text={Search}
			label="search"
			{expand}
			onclick={() => goto("/search")}
		/>
	</div>

	<FillSpace />

	<CenterHorizontal Child={Seperator} />

	<div class="flex flex-col gap-5 mb-2">
		<Button
			Text={Settings}
			label="settings"
			{expand}
			onclick={() => goto("/settings")}
		/>
	</div>
</div>
