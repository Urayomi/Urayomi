<!-- Ported from urayomi-legacy -->
<script lang="ts">
	interface Props {
		label?: string;
		description?: string;
		onChange?: (enabled: boolean) => void;
		checked?: boolean;
	}

	let {
		label = "feature name",
		description = "asdasd",
		onChange,
		checked = $bindable(false),
	}: Props = $props();

	function handleToggle() {
		checked = !checked;
		onChange?.(checked);
	}
</script>

<div
	class="flex items-center justify-between p-4 bg-surface border border-primary-text/10 rounded"
>
	<div>
		<p class="text-sm font-medium">{label}</p>
		{#if description}
			<p class="text-xs text-primary-text/40">{description}</p>
		{/if}
	</div>

	<button
		type="button"
		role="switch"
		aria-checked={checked}
		onclick={handleToggle}
		class="
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
            transition-colors duration-200 ease-in-out focus:outline-none
            {checked ? 'bg-accent' : 'bg-primary-text/10'}
        "
		aria-label="Toggle"
	>
		<span
			aria-hidden="true"
			class="
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out
                {checked ? 'translate-x-5' : 'translate-x-0'}
            "
		></span>
	</button>
</div>
