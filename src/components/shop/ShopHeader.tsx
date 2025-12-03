interface ShopHeaderProps {
    title: string;
    subtitle: string;
}

export function ShopHeader({ title, subtitle }: ShopHeaderProps) {
    return (
        <div className="mb-4 md:mb-8">
            {/* Mobile - Compact layout */}
            <div className="md:hidden">
                <div className="flex items-baseline gap-3 mb-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-0.5 h-0.5 bg-black/40" />
                        <span className="text-[8px] uppercase tracking-[0.2em] text-black/40 font-mono">Collection</span>
                    </div>
                    <h1 className="text-2xl font-brand leading-none tracking-tight">{title}</h1>
                </div>
                <p className="text-[10px] text-black/50 leading-snug font-mono pl-0">
                    {subtitle}
                </p>
            </div>

            {/* Desktop - Horizontal layout */}
            <div className="hidden md:flex items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-black/40" />
                        <span className="text-[10px] uppercase tracking-[0.25em] text-black/40 font-mono">Collection</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-brand leading-none tracking-tight">{title}</h1>
                </div>
                <p className="text-xs text-black/50 leading-relaxed max-w-md font-mono">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
