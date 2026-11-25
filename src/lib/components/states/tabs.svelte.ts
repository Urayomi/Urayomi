import type { Book } from "$lib/types/LibraryManga";

export interface Tab {
	key: string;
	title: string;
	cover: string;
}

// state machine for the tabs
export const tabsState = $state({
	tabs: [] as Tab[],
});

export function find_tab(key: string) {
	return tabsState.tabs.find((tab) => tab.key === key);
}

export function open_tab(book: Pick<Book, "location" | "cover_location" | "metadata">) {
	const existing = find_tab(book.location);
	if (existing) return existing;

	const tab: Tab = {
		key: book.location,
		title:
			book.metadata?.title ||
			book.location.split(/[\\/]/).pop() ||
			"Untitled",
		cover: book.cover_location,
	};

	tabsState.tabs.push(tab);
	return tab;
}

export function close_tab(key: string): Tab | null {
	const index = tabsState.tabs.findIndex((tab) => tab.key === key);
	if (index === -1) return null;

	tabsState.tabs.splice(index, 1);
	return tabsState.tabs[index] ?? tabsState.tabs[index - 1] ?? null;
}
