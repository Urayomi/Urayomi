<script>
	import SelectDropDown from "$lib/components/core/SelectDropDown.svelte";
	import ToggleButton from "$lib/components/core/ToggleButton.svelte";
	import { EyeIcon } from "@lucide/svelte";
	import { setTheme } from "@tauri-apps/api/app";
</script>

<div class="w-full h-full flex text-primary-text">
	<div class="p-4 bg-surface border border-primary-text/10 rounded relative">
		<div class="flex items-center gap-2">
			<EyeIcon class="w-4 h-4" />
			<h2 class="text-sm font-semibold">Appearance</h2>
		</div>
		<p class="text-xs text-primary-text/40 mt-1">Theme and UI options.</p>

		<div class="mt-4 relative space-y-2">
			<SelectDropDown
				label="Theme"
				value={"test"}
				options={["test", "asd", "qwow"]}
				onChange={() => {}}
			/>

			<ToggleButton
				label="Double Panel"
				description="Two panels instead of one per page"
				checked={false}
				onChange={() => {}}
			/>

			<ToggleButton
				label="Right To Left"
				description="Show manga panels in a RTL layout"
				checked={false}
				onChange={() => {}}
			/>
		</div>
	</div>
</div>
