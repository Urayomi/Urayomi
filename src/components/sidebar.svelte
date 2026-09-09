<script>
	import { Bookmark, Clock, Menu, Search, Settings } from "@lucide/svelte";
	import Seperator from "./common/seperator.svelte";
	import FillSpace from "./common/fill_space.svelte";
</script>

<div
	class="h-full bg-surface w-12 flex flex-col pt-2 items-center text-primary-text/90 gap-5"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="size-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
		/>
	</svg>

	<Seperator />

	<div class="gap-5 flex flex-col">
		<Bookmark strokeWidth={1.5} />
		<Clock strokeWidth={1.5} />
		<Search strokeWidth={1.5} />
	</div>

	<FillSpace />
	<Seperator />

	<div class="gap-5 flex flex-col mb-2">
		<Settings strokeWidth={1.5} />
	</div>
</div>
