interface Metadata {}

export interface LibraryManga {
	location: string;
	cover_location: string;
	pages: string;
	current_page: number;
	name: string;
	favorite: boolean;
}

type BookType = "Manga" | "Novel";

interface SystemTime {
	secs_since_epoch: number;
	anos_since_epoc: number;
}

interface BookMetadata {
	title: string;
	author: string;
	language: string;

	current_page: number;
	last_opened: SystemTime;
	created_date: SystemTime;
}

export interface Book {
	book_type: BookType;
	id: string;

	favorite: boolean;

	location: string;
	cover_location: string;
	pages: string[];

	metadata: BookMetadata;
}
