import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useConfigStore } from "../../stores/configStore";

interface ProgressBarProps {
    page: number;
    total: number;
    onChange: (page: number) => void;
}

export default function ProgressBar({ page, total, onChange }: ProgressBarProps) {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const { config } = useConfigStore();

    const [isDragging, setIsDragging] = useState(false);
    const [dragVisualPct, setDragVisualPct] = useState<number | null>(null);
    const [hoverPct, setHoverPct] = useState<number | null>(null);

    const isRTL = config.layout.rightToLeft;

    const displayPercentage = useMemo(() => {
        if (isDragging && dragVisualPct !== null) return dragVisualPct * 100;
        if (total <= 1) return 0;
        return (page / (total - 1)) * 100;
    }, [isDragging, dragVisualPct, page, total]);

    const activePageNum = useMemo(() => {
        const pct = isDragging && dragVisualPct !== null
            ? dragVisualPct
            : (hoverPct ?? (page / (total - 1)));
        return Math.round(pct * (total - 1)) + 1;
    }, [isDragging, dragVisualPct, hoverPct, page, total]);

    const pagesLeft = Math.max(0, total - activePageNum);

    const handleUpdate = useCallback(
        (clientX: number) => {
            if (!progressBarRef.current) return;

            const rect = progressBarRef.current.getBoundingClientRect();
            let pct = (clientX - rect.left) / rect.width;
            pct = Math.max(0, Math.min(1, pct));

            const logicPct = isRTL ? 1 - pct : pct;
            setDragVisualPct(logicPct);

            const newPage = Math.round(logicPct * (total - 1));
            if (newPage !== page) {
                onChange(newPage);
            }
        },
        [total, onChange, isRTL, page]
    );

    useEffect(() => {
        if (!isDragging) {
            setDragVisualPct(null);
            return;
        }

        const onMove = (e: MouseEvent | TouchEvent) => {
            const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            handleUpdate(x);
        };

        const onEnd = () => setIsDragging(false);

        document.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseup", onEnd);
        document.addEventListener("touchmove", onMove, { passive: false });
        document.addEventListener("touchend", onEnd);

        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onEnd);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onEnd);
        };
    }, [isDragging, handleUpdate]);

    return (
        <div className="w-full select-none py-2 px-4 space-y-1">
            <div className="flex items-center gap-4">
                <div
                    ref={progressBarRef}
                    className="relative flex-1 h-8 flex items-center cursor-pointer group"
                    onMouseDown={(e) => {
                        setIsDragging(true);
                        handleUpdate(e.clientX);
                    }}
                    onTouchStart={(e) => {
                        setIsDragging(true);
                        handleUpdate(e.touches[0].clientX);
                    }}
                    onMouseMove={(e) => {
                        const rect = progressBarRef.current?.getBoundingClientRect();
                        if (!rect) return;
                        let pct = (e.clientX - rect.left) / rect.width;
                        setHoverPct(isRTL ? 1 - pct : pct);
                    }}
                    onMouseLeave={() => setHoverPct(null)}
                >
                    <div className="absolute w-full h-1 bg-neutral-800/50 rounded-full" />

                    <div
                        className={`absolute h-1 bg-accent rounded-full pointer-events-none ${isDragging ? "" : "transition-[width] duration-300 ease-out"
                            }`}
                        style={{
                            width: `${displayPercentage}%`,
                            [isRTL ? 'right' : 'left']: 0
                        }}
                    />

                    {(isDragging || hoverPct !== null) && (
                        <div
                            className="absolute -top-7 z-50 pointer-events-none transition-opacity duration-200"
                            style={{
                                left: isRTL
                                    ? `${100 - (isDragging ? displayPercentage : hoverPct! * 100)}%`
                                    : `${isDragging ? displayPercentage : hoverPct! * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-neutral-700 shadow-xl animate-in fade-in zoom-in duration-150">
                                {activePageNum}
                            </div>
                        </div>
                    )}

                    <div
                        className={`absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none transform -translate-x-1/2 ${isDragging ? "scale-125" : "scale-100 group-hover:scale-110"
                            }`}
                        style={{
                            left: isRTL ? `${100 - displayPercentage}%` : `${displayPercentage}%`,
                            transition: isDragging ? 'none' : 'left 0.3s ease-out, transform 0.2s'
                        }}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-medium tracking-tight text-primary-text/40 px-1">
                <div>
                    <span className="text-primary-text/80">{activePageNum}</span>
                    <span className="mx-1">of</span>
                    <span>{total} pages</span>
                </div>

                <div className="flex items-center gap-1">
                    {pagesLeft === 0 ? (
                        <span className="text-accent uppercase text-[9px] font-bold">Finished</span>
                    ) : (
                        <>
                            <span className="text-primary-text/60">{pagesLeft}</span>
                            <span>pages left</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}