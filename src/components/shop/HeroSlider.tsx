import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface SliderItem {
    code: string;
    name: string;
    description: string;
    image: string;
    slug: string;
    category: string;
}

interface HeroSliderProps {
    items: SliderItem[];
}

export function HeroSlider({ items }: HeroSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!items.length) return;

        const id = window.setInterval(
            () => setCurrentSlide((prev) => (prev + 1) % items.length),
            5200
        );

        return () => window.clearInterval(id);
    }, [items.length]);

    if (!items.length) return null;

    return (
        <section className="py-6 relative z-10 px-2 sm:px-4">
            <div className="mx-auto max-w-[1600px]">
                <div className="relative overflow-hidden border border-black/20 bg-white">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                    <div
                        className="flex transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {items.map((item) => (
                            <div key={item.code} className="min-w-full grid md:grid-cols-[1fr,1.2fr] lg:grid-cols-[1fr,1.5fr]">
                                <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center border-r border-black/15 relative">
                                    {/* Decorative lines */}
                                    <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-black/30" />
                                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-black/30" />

                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[10px] text-black/40">[{item.code}]</span>
                                            <span className="h-px w-6 bg-black/20" />
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-black/60">{item.category}</span>
                                        </div>

                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-brand leading-[0.9] uppercase tracking-tighter">
                                            {item.name.split("/")[1] || item.name}
                                        </h2>

                                        <p className="text-xs text-black/60 leading-relaxed max-w-sm font-mono">
                                            {item.description}
                                        </p>

                                        <div className="pt-2">
                                            <Link
                                                to={`/product/${item.slug}`}
                                                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-black/70 transition-colors"
                                            >
                                                <span className="border-b border-black pb-0.5 group-hover:border-black/150 transition-colors">View Object</span>
                                                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative h-[300px] md:h-[400px] bg-[#f0f0f0] overflow-hidden group">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Slider controls at bottom */}
                    <div className="flex items-center justify-between gap-4 p-4 border-t border-black/10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-black animate-pulse" />
                        </div>
                        <div className="flex items-center gap-1">
                            {items.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-0.5 transition-all duration-300 ${currentSlide === idx ? "w-6 bg-black" : "w-3 bg-black/20 hover:bg-black/40"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
