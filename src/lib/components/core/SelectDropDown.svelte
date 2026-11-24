<!-- ported from urayomi-legacy -->
<script lang="ts" generics="T extends string">
	interface Props {
		label: string;
		value: T;
		options: T[];
		onChange: (value: T) => void;
	}

	let { label, value, options, onChange }: Props = $props();

	let isOpen = $state(false);
	let container = $state<HTMLDivElement>();

	function handleClick(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			isOpen = false;
		}
	}

	function select(opt: T) {
		onChange(opt);
		isOpen = false;
	}
</script>

<svelte:window onmousedown={handleClick} />

<div class="relative w-full" bind:this={container}>
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class="w-full flex items-center justify-between bg-surface border border-primary-text/10 rounded px-4 py-3 hover:bg-primary-text/5 transition-all"
	>
		<div class="text-left">
			<p
				class="text-[10px] uppercase tracking-wider text-primary-text/40 font-bold"
			>
				{label}
			</p>
			<p class="text-sm font-medium capitalize">{value}</p>
		</div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-4 h-4 transition-transform {isOpen ? 'rotate-180' : ''}"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m19.5 8.25-7.5 7.5-7.5-7.5"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute left-0 right-0 mt-2 bg-surface border border-primary-text/10 rounded-lg z-1337 shadow-2xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
		>
			{#each options as opt (opt)}
				<button
					type="button"
					onclick={() => select(opt)}
					class="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-primary-text/5 capitalize transition-colors"
				>
					<span
						class={value === opt
							? "text-primary-text font-semibold"
							: "text-primary-text/60"}
					>
						{opt}
					</span>
					{#if value === opt}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4 text-accent"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m4.5 12.75 6 6 9-13.5"
							/>
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
