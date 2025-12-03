import { forwardRef, useState } from "react";

interface FilterGroup {
    label: string;
    values: string[];
}

interface MobileFilterBarProps {
    filterGroups: FilterGroup[];
    activeCategory: string;
    activeMaterial: string | null;
    activeFinish: string | null;
    onFilterClick: (label: string, value: string) => void;
    style?: React.CSSProperties;
}

export const MobileFilterBar = forwardRef<HTMLDivElement, MobileFilterBarProps>(
    ({ filterGroups, activeCategory, activeMaterial, activeFinish, onFilterClick, style }, ref) => {
        const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

        const isFilterActive = (label: string, value: string) => {
            if (label === "Category") return activeCategory === value;
            if (label === "Material") return activeMaterial === value;
            if (label === "Finish") return activeFinish === value;
            return false;
        };

        return (
            <div
                className="lg:hidden relative z-30"
            // Parent handles wrapper ref
            >
                <div
                    ref={ref}
                    className="border border-black/20 bg-white/90 backdrop-blur-md transition-all duration-300 ease-out"
                    style={style}
                >
                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.35em] font-bold text-black/80 p-4"
                    >
                        <span>Filters</span>
                        <span
                            className="text-black/50 transition-transform duration-200"
                            style={{ transform: mobileFiltersOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                            ▶
                        </span>
                    </button>

                    {/* Dropdown - Absolute positioned to overlay */}
                    {mobileFiltersOpen && (
                        <div className="absolute top-full left-0 right-0 border-l border-r border-b border-black/20 bg-white/95 backdrop-blur-md p-4 space-y-4 z-50 shadow-xl">
                            {filterGroups.map((group) => (
                                <div key={group.label} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-black/50" />
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/70">
                                            {group.label}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {group.values.map((value) => (
                                            <button
                                                key={value}
                                                onClick={() => onFilterClick(group.label, value)}
                                                className={`w-full text-left py-1.5 px-2 text-[10px] uppercase tracking-[0.15em] transition-all duration-200 border ${isFilterActive(group.label, value)
                                                        ? "border-black bg-black/5 font-bold"
                                                        : "border-black/10 hover:border-black/40"
                                                    }`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

MobileFilterBar.displayName = "MobileFilterBar";
