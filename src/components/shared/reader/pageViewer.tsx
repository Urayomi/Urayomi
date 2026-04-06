import { useState, useEffect, useRef, useCallback } from "react";
import { useConfigStore } from "../../../stores/configStore";
import { MangaDetail } from "../../../types/ExtensionData";
import { fixBook } from "../../../utils/fixBook";
import ProgressBar from "../ProgressBar";

interface PageCache {
    [chapterIndex: number]: string[];
}

export default function PageViewer() {
    const { config } = useConfigStore();
    const [page, setPage] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [pages, setPages] = useState<string[]>([]);
    const [pageCache, setPageCache] = useState<PageCache>({});
    const [mangaDetail, setMangaDetail] = useState({} as MangaDetail);
    const [isLoading, setIsLoading] = useState(false);
    const [displayImgs, setDisplayImgs] = useState<(string | null)[]>([]);

    const mangaChapter = config.pageRoutes[config.currentPage]?.state;
    const manga = mangaChapter?.manga;

    useEffect(() => {
        if (!manga || !config.installedSources?.length) return;
        const getDetail = async () => {
            try {
                const fixedBook = await fixBook(manga, config);
                const detail = fixedBook.getDetail
                    ? await fixedBook.getDetail(fixedBook.link)
                    : fixedBook;
                setMangaDetail(detail);
            } catch (error) {
                console.error("Error fetching manga detail:", error);
            }
        };
        getDetail();
    }, [manga, config]);

    useEffect(() => {
        if (!mangaDetail?.chapters || !mangaChapter?.chapter) return;
        const index = mangaDetail.chapters.findIndex(
            (ch) => ch.name === mangaChapter.chapter.name
        );
        setChapterIndex(Math.max(0, index));
    }, [mangaDetail, mangaChapter]);

    useEffect(() => {
        if (!mangaChapter || !config.installedSources) return;

        const getPages = async () => {
            try {
                setIsLoading(true);
                const source = config.installedSources.find(
                    (s) => s.source.name === mangaChapter.manga.source
                );
                if (!source) return;

                if (pageCache[chapterIndex]) {
                    setPages(pageCache[chapterIndex]);
                    setIsLoading(false);
                    return;
                }

                const pageList = await source.getPageList(mangaChapter.chapter.url);
                setPages(pageList);
                setPageCache((prev) => ({ ...prev, [chapterIndex]: pageList }));
                setPage(0);
            } catch (error) {
                console.error("Error fetching pages:", error);
                setPages([]);
            } finally {
                setIsLoading(false);
            }
        };

        getPages();
    }, [mangaChapter, config.installedSources, chapterIndex]);

    useEffect(() => {
        if (!pages.length) return;

        const preloadCount = 3;
        const newDisplayImgs: (string | null)[] = [...displayImgs];

        const preloadImage = (src: string, index: number) => {
            const img = new Image();
            img.src = src;
            img.decode?.().catch(() => { });
            img.onload = () => {
                setDisplayImgs((prev) => {
                    const copy = [...prev];
                    copy[index] = src;
                    return copy;
                });
            };
        };

        for (let i = page; i <= page + preloadCount && i < pages.length; i++) {
            if (!newDisplayImgs[i]) newDisplayImgs[i] = null;
            preloadImage(pages[i], i);
        }
        setDisplayImgs(newDisplayImgs);
    }, [page, pages]);



    const handleNextPage = useCallback(() => {
        setPage((p) => p + (config.layout.doublePanel ? 2 : 1));
    }, [config.layout.doublePanel]);

    const handlePrevPage = useCallback(() => {
        setPage((p) => p - (config.layout.doublePanel ? 2 : 1));
    }, [config.layout.doublePanel]);

    const isSinglePageLayout = config.layout.doublePanel;
    const currentPageImg = displayImgs[page] || pages[page];
    const nextPageImg = displayImgs[page + 1] || pages[page + 1];

    return (
        <div className="w-full h-full overflow-hidden flex flex-col bg-background">
            <div className={`flex-1 flex gap-2 ${config.layout.rightToLeft ? "flex-row-reverse" : ""} sm:gap-4 p-4 sm:p-8 items-center justify-center overflow-hidden bg-background`}>
                {isSinglePageLayout ? (
                    <>
                        {currentPageImg ? (
                            <img
                                src={currentPageImg}
                                className="max-h-full max-w-1/2 object-contain cursor-pointer rounded-lg drop-shadow-2xl"
                                onClick={config.layout.rightToLeft ? handlePrevPage : handleNextPage}
                            />
                        ) : (
                            <div className="max-h-full max-w-1/2 flex items-center justify-center rounded-lg bg-neutral-900 text-neutral-500">
                                <div className="text-center text-sm">No pages available</div>
                            </div>
                        )}

                        {nextPageImg ? (
                            <img
                                src={nextPageImg}
                                className="max-h-full max-w-1/2 object-contain cursor-pointer rounded-lg drop-shadow-2xl"
                                onClick={config.layout.rightToLeft ? handleNextPage : handlePrevPage}
                                alt={`Page ${page + 2}`}
                            />
                        ) : (
                            <div className="max-h-full w-full max-w-1/2 flex items-center justify-center rounded-lg bg-neutral-900">
                                <div className="text-center text-sm text-primary-text/50 mb-2">
                                    Next Chapter
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <img
                        src={currentPageImg}
                        className="max-h-full max-w-full object-contain cursor-pointer rounded-lg drop-shadow-2xl"
                        onClick={handleNextPage}
                        alt={`Page ${page + 1}`}
                    />
                )}
            </div>

            <div className="bg-surface border-t border-background px-4 py-2 z-50">
                <ProgressBar
                    page={page}
                    total={pages.length}
                    onChange={setPage}
                />
            </div>
        </div>
    );
}