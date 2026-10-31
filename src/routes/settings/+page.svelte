<script lang="ts">
	import { invoke } from "@tauri-apps/api/core";
	import {
		Settings,
		Palette,
		BookOpen,
		Library,
		Monitor,
		Moon,
		Sun,
	} from "@lucide/svelte";

	let active_section = $state("General");

	let theme = $state("System");
	let reading_direction = $state("Left to right");
	let show_page_numbers = $state(true);
	let confirm_exit = $state(true);

	const sections = [
		{ name: "General", icon: Settings },
		{ name: "Appearance", icon: Palette },
		{ name: "Reader", icon: BookOpen },
		{ name: "Library", icon: Library },
	];

	const themes = [
		{ name: "System", icon: Monitor },
		{ name: "Dark", icon: Moon },
		{ name: "Light", icon: Sun },
	];
</script>

<main
	class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-2 font-sans text-primary-text"
>
	<div class="flex max-w-xl min-w-0 flex-col gap-4">
		<section>
			<h2
				class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-text/50"
			>
				<Settings class="size-3.5" />
				General
			</h2>
			<div
				class="divide-y divide-primary-text/10 rounded border border-primary-text/10 bg-surface"
			>
				<div class="flex items-center justify-between gap-4 p-3">
					<div class="min-w-0">
						<p class="text-xs">Confirm before exit</p>
						<p class="mt-0.5 text-xs text-primary-text/50">
							Ask before closing the application.
						</p>
					</div>

					<button
						type="button"
						role="switch"
						aria-label="Confirm before exit"
						aria-checked={confirm_exit}
						onclick={() => (confirm_exit = !confirm_exit)}
						class="flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 outline-none transition focus-visible:ring-1 focus-visible:ring-primary-text/30
                            {confirm_exit
							? 'bg-primary-text'
							: 'bg-primary-text/20'}"
					>
						<span
							class="size-4 rounded-full bg-surface transition-transform {confirm_exit
								? 'translate-x-4'
								: 'translate-x-0'}"
						></span>
					</button>
				</div>
			</div>
		</section>

		<section>
			<h2
				class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-text/50"
			>
				<Palette class="size-3.5" />
				Appearance
			</h2>
			<div
				class="divide-y divide-primary-text/10 rounded border border-primary-text/10 bg-surface"
			>
				<div class="flex items-center justify-between gap-4 p-3">
					<div class="min-w-0">
						<p class="text-xs">Theme</p>
						<p class="mt-0.5 text-xs text-primary-text/50">
							Choose your preferred appearance.
						</p>
					</div>

					<div
						class="flex shrink-0 items-center gap-0.5 rounded border border-primary-text/10 p-0.5"
					>
						{#each themes as option}
							<button
								type="button"
								onclick={() => (theme = option.name)}
								aria-label={option.name}
								aria-pressed={theme === option.name}
								class="flex items-center gap-1.5 rounded px-2 py-1 text-xs outline-none transition focus-visible:ring-1 focus-visible:ring-primary-text/30
                                    {theme === option.name
									? 'bg-primary-text/10 text-primary-text'
									: 'text-primary-text/50 hover:text-primary-text'}"
							>
								<option.icon class="size-3.5" />
								<span class="hidden sm:inline">{option.name}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<section>
			<h2
				class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-text/50"
			>
				<BookOpen class="size-3.5" />
				Reader
			</h2>
			<div
				class="divide-y divide-primary-text/10 rounded border border-primary-text/10 bg-surface"
			>
				<label class="flex items-center justify-between gap-4 p-3">
					<span class="text-xs">Reading direction</span>
					<select
						bind:value={reading_direction}
						class="h-8 max-w-40 rounded border border-primary-text/10 bg-surface px-2 text-xs text-primary-text outline-none focus:border-primary-text/30"
					>
						<option>Left to right</option>
						<option>Right to left</option>
					</select>
				</label>

				<div class="flex items-center justify-between gap-4 p-3">
					<div class="min-w-0">
						<p class="text-xs">Page numbers</p>
						<p class="mt-0.5 text-xs text-primary-text/50">
							Show the current page while reading.
						</p>
					</div>

					<button
						type="button"
						role="switch"
						aria-label="Show page numbers"
						aria-checked={show_page_numbers}
						onclick={() => (show_page_numbers = !show_page_numbers)}
						class="flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 outline-none transition focus-visible:ring-1 focus-visible:ring-primary-text/30
                            {show_page_numbers
							? 'bg-primary-text'
							: 'bg-primary-text/20'}"
					>
						<span
							class="size-4 rounded-full bg-surface transition-transform {show_page_numbers
								? 'translate-x-4'
								: 'translate-x-0'}"
						></span>
					</button>
				</div>
			</div>
		</section>

		<section>
			<h2
				class="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-primary-text/50"
			>
				<Library class="size-3.5" />
				Library
			</h2>
			<div
				class="divide-y divide-primary-text/10 rounded border border-primary-text/10 bg-surface"
			>
				<div class="flex items-center justify-between gap-4 p-3">
					<div class="min-w-0">
						<p class="text-xs">Library storage</p>
						<p class="mt-0.5 text-xs text-primary-text/50">
							Refresh your indexed manga list.
						</p>
					</div>

					<button
						type="button"
						class="shrink-0 rounded bg-primary-text/10 px-3 py-1.5 text-xs outline-none transition hover:bg-primary-text/20 focus-visible:ring-1 focus-visible:ring-primary-text/30"
						onclick={() => invoke("get_manga_list")}
					>
						Refresh library
					</button>
				</div>
			</div>
		</section>
	</div>
</main>
