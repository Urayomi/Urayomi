
<p align="center">
  <img src="https://img.shields.io/github/stars/Urayomi/Urayomi?style=for-the-badge&label=Stars" />
  <img src="https://img.shields.io/github/v/release/Urayomi/Urayomi?style=for-the-badge&label=Release" />
  <img src="https://img.shields.io/github/downloads/Urayomi/Urayomi/total?style=for-the-badge&label=Downloads" />
  <img src="https://img.shields.io/github/license/Urayomi/Urayomi?style=for-the-badge&label=License" />

  <a href="https://discord.gg/MXzbuWZ3wn">
    <img src="https://img.shields.io/badge/discord-join%20server-5865F2?style=for-the-badge&logo=discord" />
  </a>
</p>

# Urayomi

**Urayomi** is an open-source manga reader that supports every device, from desktop to mobile.

## Showcase

<div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
  <img src="showcase/page.png" alt="Showcase Page" width="45%">
  <img src="showcase/reading.png" alt="Reading Mode" width="45%">
</div>

---

## Features

### Please note that only search has reading features and i am extending them onto everything else

- [x] Cross-platform support (desktop + mobile)
- [x] Extension-based content system
- [x] Customizable reading experience
- [x] Lightweight and fast UI

---

## Roadmap

> The legacy rewrite is the main blocker right now — new work lands on the
> recoded codebase, and some legacy behavior may still leak through.
>
> Benchmarked against Mihon, Aidoku, Panels, Chunky, YACReader and JustRead:
> these are the baseline features readers expect.

### Tabs & Navigation

- [ ] Chrome/VSC-style tabbed topbar (replace the current topbar)
- [ ] Restore open tabs, scroll position, and last page on launch
- [ ] Keyboard shortcuts and gamepad navigation
- [ ] Command palette / quick switcher (`Ctrl/Cmd+K`)

### Reader

- [ ] Preview manga live when changing pages or settings
- [ ] Reading features (progress, bookmarks, modes) on every route, not just Search
- [ ] Viewer modes: paged, webtoon/vertical, infinite scroll
- [ ] Reading direction: LTR/RTL, auto-detected from ComicInfo.xml
- [ ] Double-page spreads and wide-page splitting
- [ ] Guided/panel-by-panel view
- [ ] Zoom/pan, double-tap zoom, page thumbnails, jump to page
- [ ] Fit modes (width/height/original), crop borders, background color
- [ ] Brightness, contrast, and grayscale/color correction
- [ ] Configurable tap zones, volume-key paging, fullscreen, keep screen on, orientation lock
- [ ] Preload and cache nearby pages to avoid flicker
- [ ] Per-series reader setting overrides

### Library

- [ ] Implement the Library page (currently empty)
- [ ] Implement the History page with resume position
- [ ] Read/unread state, chapter counters, continue-reading shelf
- [ ] Categories/tags/collections with smart filters and sorting
- [ ] Grid/list layouts and batch actions (mark read, favorite, delete)
- [ ] Bookmark and progress tracking improvements
- [ ] Folder watching / automatic library scan
- [ ] Metadata editing and cover refresh
- [ ] Duplicate detection and cleanup
- [ ] Import from other readers (Mihon backup, YACReader/Panels folder layouts)

### Files & Formats

- [ ] CBR/RAR, CB7, CBT, PDF, and plain-folder support
- [ ] Stream pages from archives instead of extracting everything
- [ ] ComicInfo.xml parsing (series, volume, chapter, author, reading direction)
- [ ] CBZ export/repack and batch conversion
- [ ] Storage management: cache size limits and cleanup

### Tracking & Sync

- [ ] Tracker integrations: MAL, AniList, Kitsu, MangaUpdates, Shikimori, Bangumi, MangaBaka
- [ ] Auto-update tracker progress/status when chapters are read
- [ ] Local auto-backup and JSON export/import
- [ ] Cloud sync via WebDAV, Dropbox, or Google Drive
- [ ] OPDS client and Komga/Kavita/Suwayomi server support

### Notifications & Automation

- [ ] Scheduled library updates
- [ ] New chapter notifications
- [ ] Auto-import from watched folders and auto-download new chapters

### Novels

- [ ] Novel reader settings: font, size, line height, margins, themes
- [ ] Chapter/TOC navigation and reading progress
- [ ] Bookmarks, highlights, and notes
- [ ] TTS read-aloud
- [ ] Better EPUB parsing (chapters, cover, metadata)

### Content & Platform

- [ ] Finish the extension-based content system
- [ ] Download queue for extension sources (bulk and automatic)
- [ ] Light/dark/AMOLED themes with accent colors
- [ ] Reading statistics: time, pages, streaks, goals
- [ ] Incognito mode and NSFW content filtering
- [ ] Localization (i18n) and accessibility (screen reader, reduced motion, high contrast)
- [ ] Mobile/tablet layouts with touch gestures
- [ ] Discord Rich Presence improvements

---

## Supporting

If you find this project useful, consider starring the repository. It helps visibility and development motivation.

## Platforms

| Platform | Status    |
| -------- | --------- |
| Windows  | Supported |
| macOS    | Supported |
| Linux    | Supported |
| Android  | Supported |
| iOS      | Supported |

## Versioning

- Codebase is currently being recoded from legacy
- Some legacy behavior may remain

---

## Credits

This project was inspired by:

- [Mangayomi](https://github.com/kodjodevf/mangayomi)
- [Aidoku](https://github.com/Aidoku/Aidoku)

---

## Stats

<img src="https://count.getloli.com/@urayomi?name=urayomi&theme=original-old" alt="Visitor Count" />
