import { forwardRef } from "react";

interface FilterGroup {
    label: string;
    values: string[];
}

interface FilterSidebarProps {
    filterGroups: FilterGroup[];
    activeCategory: string;
    activeMaterial: string | null;
    activeFinish: string | null;
    onFilterClick: (label: string, value: string) => void;
    style?: React.CSSProperties;
}

export const FilterSidebar = forwardRef<HTMLDivElement, FilterSidebarProps>(
    ({ filterGroups, activeCategory, activeMaterial, activeFinish, onFilterClick, style }, ref) => {

        const isFilterActive = (label: string, value: string) => {
            if (label === "Category") return activeCategory === value;
            if (label === "Material") return activeMaterial === value;
            if (label === "Finish") return activeFinish === value;
            return false;
        };

        return (
            <aside className="hidden lg:block w-full lg:w-56 flex-shrink-0">
                <div
                    className="relative lg:self-start"
                // The wrapper ref is handled in the parent usually, but here we might need to split refs.
                // In the original code: wrapperRef is on the outer div, cardRef is on the inner div.
                // I'll assume the parent handles the wrapper and passes the card style.
                // Wait, the parent needs the wrapper ref to calculate positions.
                // So I should probably forward the wrapper ref? Or just let the parent render the wrapper.
                // Let's let the parent render the wrapper for sticky logic simplicity, and this component renders the card.
                >
                    {/* This component will render the CARD. The parent should wrap it in the wrapper div with the ref. */}
                    <div
                        ref={ref}
                        className="z-10"
                        style={style}
                    >
                        {/* Filter container with border */}
                        <div className="border border-black/20 bg-white/80 backdrop-blur-sm overflow-hidden">
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/30 via-blue-500/10 to-transparent" />

                            {/* Header */}
                            <div className="px-6 py-4 border-b border-black/10 bg-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500" />
                                    <span className="text-[11px] uppercase tracking-[0.3em] font-bold text-black/80">Filters</span>
                                </div>
                            </div>

                            {/* Filter groups */}
                            <div className="p-6 space-y-6">
                                {filterGroups.map((group) => (
                                    <div key={group.label} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-500/60" />
                                            <h3 className="text-[9px] uppercase tracking-[0.2em] font-bold text-black/70">
                                                {group.label}
                                            </h3>
                                        </div>
                                        <div className="space-y-0.5">
                                            {group.values.map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => onFilterClick(group.label, value)}
                                                    className={`w-full text-left py-1.5 px-2 text-[10px] uppercase tracking-[0.15em] transition-all duration-200 border-l-2 ${isFilterActive(group.label, value)
                                                        ? "border-blue-500 bg-blue-500/5 text-black font-bold pl-3"
                                                        : "border-transparent text-black/50 hover:text-black hover:border-blue-500/30 hover:pl-3"
                                                        }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        );
    }
);

FilterSidebar.displayName = "FilterSidebar";
