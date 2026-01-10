import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, PanInfo, useTransform, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Product } from "@/types/product";

// --- Configuration ---
const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 288;
const GAP = 50; // Slightly more spacing between cards
const DRAG_FACTOR = 1;

// --- Components ---

interface ProductCardProps {
    product: Product;
    x: any;
    y: any;
    indexX: number;
    indexY: number;
    totalCols: number;
    totalRows: number;
    isDragging: React.MutableRefObject<boolean>;
    isMobile: boolean;
}

const ProductCard = ({ product, x, y, indexX, indexY, totalCols, totalRows, isDragging, isMobile }: ProductCardProps) => {
    const navigate = useNavigate();
    const width = ITEM_WIDTH;
    const height = ITEM_HEIGHT;
    const currentGap = GAP;

    const baseX = (indexX - Math.floor(totalCols / 2)) * (width + currentGap);
    const baseY = (indexY - Math.floor(totalRows / 2)) * (height + currentGap);

    const sphereRadius = isMobile ? 720 : 1100;
    const tiltScale = isMobile ? 0.9 : 0.78;
    const twistMax = isMobile ? 2.5 : 4.5;
    const depthScale = isMobile ? 420 : 900;
    const focusTightness = isMobile ? 3.0 : 3.6;
    const fisheyeK = isMobile ? 0.14 : 0.16;

    const getWrappedValue = (v: number, base: number, total: number) => {
        const offset = v + base;
        return ((offset + total / 2) % total + total) % total - total / 2;
    };

    const applyFisheye = (wx: number, wy: number) => {
        const r = Math.sqrt(wx * wx + wy * wy);
        const R = sphereRadius * 1.05;
        const t = Math.min(r / R, 1);
        const factor = 1 + fisheyeK * (1 - t * t); // magnify center, keep edges tighter
        return {
            fx: wx * factor,
            fy: wy * factor,
            r,
            factor
        };
    };

    const getSphereMetrics = (vx: number, vy: number) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * (width + currentGap));
        const wy = getWrappedValue(Number(vy), baseY, totalRows * (height + currentGap));
        const { fx, fy } = applyFisheye(wx, wy);

        const distance2D = Math.sqrt(fx * fx + fy * fy) || 1;
        const clampFactor = Math.min(distance2D, sphereRadius * 0.998) / distance2D;
        const sx = fx * clampFactor;
        const sy = fy * clampFactor;

        const zSurface = Math.sqrt(Math.max(sphereRadius * sphereRadius - sx * sx - sy * sy, 0));

        const diag = (Math.abs(sx) / sphereRadius) * (Math.abs(sy) / sphereRadius);
        const tiltBoost = 1 + diag * 0.12;
        const depthBoost = 1 + diag * 0.25;

        const tiltY = ((Math.atan2(sx, zSurface) * 180) / Math.PI) * tiltBoost * tiltScale;    // yaw outward from center
        const tiltX = ((-Math.atan2(sy, zSurface) * 180) / Math.PI) * tiltBoost * tiltScale;   // pitch outward from center

        const twist = ((sx * sy) / (sphereRadius * sphereRadius)) * twistMax;
        const zOffset = (zSurface - sphereRadius) * depthBoost; // 0 at center, negative as it arcs away

        const focus = Math.pow(zSurface / sphereRadius, focusTightness);

        return { tiltX, tiltY, twist, zOffset, distance2D, focus };
    };

    const xPos = useTransform([x, y], ([vx, vy]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * (width + currentGap));
        const wy = getWrappedValue(Number(vy), baseY, totalRows * (height + currentGap));
        const { fx } = applyFisheye(wx, wy);
        return fx + window.innerWidth / 2 - width / 2;
    });

    const yPos = useTransform([x, y], ([vx, vy]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * (width + currentGap));
        const wy = getWrappedValue(Number(vy), baseY, totalRows * (height + currentGap));
        const { fy } = applyFisheye(wx, wy);
        return fy + window.innerHeight / 2 - height / 2;
    });

    const rotateY = useTransform([x, y], ([vx, vy]: any[]) => {
        const { tiltY } = getSphereMetrics(vx, vy);
        return tiltY;
    });

    const rotateX = useTransform([x, y], ([vx, vy]: any[]) => {
        const { tiltX } = getSphereMetrics(vx, vy);
        return tiltX;
    });

    const rotateZ = useTransform([x, y], ([vx, vy]: any[]) => {
        const { twist } = getSphereMetrics(vx, vy);
        return twist;
    });

    const zPos = useTransform([x, y], ([vx, vy]: any[]) => {
        const { zOffset } = getSphereMetrics(vx, vy);
        return zOffset * depthScale;
    });

    // Slightly enlarge the center card; gently shrink distant cards for depth while keeping spacing anchors.
    const scale = useTransform([x, y], ([vx, vy]: any[]) => {
        const { distance2D } = getSphereMetrics(vx, vy);
        const bumpRadius = sphereRadius * 0.4;
        const t = Math.max(0, 1 - distance2D / bumpRadius);
        const centerBump = 0.28 * Math.pow(t, 1.2); // larger center card

        const norm = Math.min(distance2D / (sphereRadius * 1.05), 1);
        const depthFalloff = 0.06 * norm;

        return Math.max(0.92, 1 - depthFalloff + centerBump);
    });

    const opacity = 1;
    const zIndex = useTransform([x, y], ([vx, vy]: any[]) => {
        const { zOffset } = getSphereMetrics(vx, vy);
        return Math.round(1000 + zOffset * 10);
    });

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        navigate(`/product/${product.slug}`);
    };

    return (
        <motion.div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                x: xPos,
                y: yPos,
                z: zPos,
                rotateX,
                rotateY,
                rotateZ,
                width: width,
                height: height,
                zIndex,
                scale,
                opacity: 1,
                transformStyle: "preserve-3d"
            }}
            className="flex items-center justify-center pointer-events-none p-4"
        >
            <motion.div
                style={{ opacity: 1 }}
                className="w-full h-full flex flex-col pointer-events-none bg-white border border-black/10 overflow-hidden relative shadow-sm"
            >
                <div
                    onClick={handleClick}
                    className="block w-full h-full px-6 pb-6 pt-5 pointer-events-auto cursor-pointer flex flex-col gap-3 transition-colors duration-300 hover:bg-black/[0.006] appearance-none"
                    draggable={false}
                >
                    {/* Title */}
                    <h3
                        className="font-brand text-[10px] uppercase tracking-tight text-black font-semibold"
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        title={product.name}
                    >
                        {product.name}
                    </h3>

                    {/* Image */}
                    <div className="w-full h-[190px] relative flex items-center justify-center bg-white overflow-hidden">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
                                draggable={false}
                            />
                        ) : (
                            <div className="text-black/30 font-mono text-[10px] uppercase tracking-[0.2em]">Image pending</div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="w-full mt-auto space-y-1">
                        <div className="w-full flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-black/50">
                            <span className="truncate">{product.category}</span>
                            <span className="text-black/35">Lot</span>
                        </div>
                        <p className="font-mono text-[11px] font-semibold text-black/70 tabular-nums">LKR {product.priceLKR.toLocaleString()}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default function Products() {
    const { data: products = [], isLoading } = useProducts();
    const isDragging = useRef(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    type Filters = {
        categories: string[];
        finishes: string[];
        maxPrice: number | null;
        featuredOnly: boolean;
    };

    const categoryOptions = useMemo(() => ["ring", "chain", "bracelet", "ear-cuff"], []);

    const priceStats = useMemo(() => {
        if (!products.length) return { min: 0, max: 0 };
        const visible = products.filter((p) => p.isVisible !== false);
        if (!visible.length) return { min: 0, max: 0 };
        const prices = visible.map((p) => p.priceLKR);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [products]);

    const availableFinishes = useMemo(() => {
        const finishes = new Set<string>();
        products.forEach((p) => {
            if (p.finish) finishes.add(p.finish);
        });
        return Array.from(finishes);
    }, [products]);

    const parseInitialFilters = (): Filters => {
        const catParams = searchParams.getAll("category").filter(Boolean);
        const finishParams = searchParams.getAll("finish").filter(Boolean);
        const priceParam = Number(searchParams.get("priceMax"));
        const featuredParam = searchParams.get("featured");

        return {
            categories: catParams.length ? catParams : [],
            finishes: finishParams.length ? finishParams : [],
            maxPrice: Number.isFinite(priceParam) && priceParam > 0 ? priceParam : null,
            featuredOnly: featuredParam === "1",
        };
    };

    const [filters, setFilters] = useState<Filters>(parseInitialFilters);

    // Hydrate max price once products load so slider has a bound even without URL param
    useEffect(() => {
        if (!priceStats.max) return;
        setFilters((prev) => ({
            ...prev,
            maxPrice: prev.maxPrice ?? priceStats.max,
        }));
    }, [priceStats.max]);

    // Keep query string in sync with current filters for shareable URLs
    useEffect(() => {
        if (!priceStats.max) return;
        const params = new URLSearchParams();
        filters.categories.forEach((cat) => params.append("category", cat));
        filters.finishes.forEach((fin) => params.append("finish", fin));
        if (filters.maxPrice && filters.maxPrice < priceStats.max) {
            params.set("priceMax", String(Math.round(filters.maxPrice)));
        }
        if (filters.featuredOnly) {
            params.set("featured", "1");
        }
        setSearchParams(params, { replace: true });
    }, [filters, priceStats.max, setSearchParams]);

    const toggleCategory = (cat: string) => {
        setFilters((prev) => {
            const exists = prev.categories.includes(cat);
            return {
                ...prev,
                categories: exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
            };
        });
    };

    const toggleFinish = (finish: string) => {
        setFilters((prev) => {
            const exists = prev.finishes.includes(finish);
            return {
                ...prev,
                finishes: exists ? prev.finishes.filter((f) => f !== finish) : [...prev.finishes, finish],
            };
        });
    };

    const updatePrice = (value: number) => {
        setFilters((prev) => ({
            ...prev,
            maxPrice: Math.max(priceStats.min, Math.min(value, priceStats.max)),
        }));
    };

    const clearFilters = () => {
        setFilters({
            categories: [],
            finishes: [],
            maxPrice: priceStats.max || null,
            featuredOnly: false,
        });
    };

    const priceMaxValue = filters.maxPrice ?? priceStats.max;
    const pricePercent = priceStats.max > priceStats.min
        ? ((priceMaxValue - priceStats.min) / (priceStats.max - priceStats.min)) * 100
        : 100;

    const filteredProducts = useMemo(() => {
        if (!products.length) return [];
        return products.filter((p: Product) => {
            if (p.isVisible === false) return false;
            if (filters.categories.length && !filters.categories.includes(p.category)) return false;
            if (filters.finishes.length && (!p.finish || !filters.finishes.includes(p.finish))) return false;
            if (filters.featuredOnly && !p.isFeatured) return false;
            if (filters.maxPrice && p.priceLKR > filters.maxPrice) return false;
            return true;
        });
    }, [products, filters]);

    const springConfig = { stiffness: 400, damping: 50, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const GRID_COLS = 11;
    const GRID_ROWS = 11;

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const gridItems = useMemo(() => {
        if (!filteredProducts.length) return [];
        const items = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const productIndex = (r * GRID_COLS + c) % filteredProducts.length;
                items.push({
                    ...filteredProducts[productIndex],
                    indexX: c,
                    indexY: r,
                });
            }
        }
        return items;
    }, [filteredProducts]);

    const onPanStart = () => { isDragging.current = true; };
    const onPan = (event: any, info: PanInfo) => {
        x.set(x.get() + info.delta.x);
        y.set(y.get() + info.delta.y);
    };
    const onPanEnd = (event: any, info: PanInfo) => {
        setTimeout(() => { isDragging.current = false; }, 50);
        const distX = ITEM_WIDTH + GAP;
        const distY = ITEM_HEIGHT + GAP;
        const velX = info.velocity.x;
        const velY = info.velocity.y;

        // Snapping with slightly more momentum for tactile feel
        const targetX = Math.round((x.get() + velX * 0.15) / distX) * distX;
        const targetY = Math.round((y.get() + velY * 0.15) / distY) * distY;

        x.set(targetX);
        y.set(targetY);
    };

    const topButtonClass = "transition-opacity flex items-center gap-2 px-3 py-2 border border-black/25 bg-white/85 shadow-sm rounded-none w-[150px]";

    return (
        <div className="bg-[#f7f5ef] w-full h-screen overflow-hidden relative font-body selection:bg-none select-none">
            {/* --- WORLD LAYER --- */}
            <div
                className="absolute inset-0 z-0"
                style={{ perspective: isMobile ? "1200px" : "1700px", perspectiveOrigin: "50% 50%" }}
            >
                <motion.div
                    className="absolute inset-[-18%] opacity-[0.8]"
                    style={{
                        x: useTransform(springX, v => Number(v) * 0.018),
                        y: useTransform(springY, v => Number(v) * 0.018),
                        backgroundImage: `
                            radial-gradient(circle at 22% 28%, rgba(0,0,0,0.08) 0 140px, transparent 230px),
                            radial-gradient(circle at 78% 68%, rgba(0,0,0,0.07) 0 180px, transparent 280px),
                            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0 220px, transparent 340px),
                            radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px),
                            linear-gradient(135deg, #f9f4e8 0%, #f2eadc 40%, #ede3d2 100%)
                        `,
                        backgroundSize: 'auto, auto, auto, 18px 18px, cover',
                        filter: 'contrast(1.05) saturate(1.02)'
                    }}
                />

                {/* Slow trail layer for subtle motion */}
                <motion.div
                    className="absolute inset-[-20%] opacity-[0.12] pointer-events-none"
                    style={{
                        x: useTransform(springX, v => Number(v) * 0.01),
                        y: useTransform(springY, v => Number(v) * 0.01),
                        backgroundImage: `
                            repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 120px),
                            repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 120px)
                        `,
                        backgroundSize: '140px 140px, 140px 140px',
                        filter: 'blur(0.6px)'
                    }}
                />

                {/* Subtle grain that drifts with motion, stays behind cards */}
                <motion.div
                    className="absolute inset-[-22%] opacity-[0.05] mix-blend-multiply pointer-events-none"
                    style={{
                        x: useTransform(springX, v => Number(v) * -0.004),
                        y: useTransform(springY, v => Number(v) * -0.004),
                        backgroundImage: `
                            repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px),
                            repeating-linear-gradient(90deg, rgba(0,0,0,0.012) 0px, rgba(0,0,0,0.012) 1px, transparent 1px, transparent 3px)
                        `,
                        backgroundSize: '160px 160px, 180px 180px',
                        filter: 'blur(0.25px)'
                    }}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                    </div>
                ) : (
                    <div className="relative z-20">
                        <motion.div
                            onPanStart={onPanStart}
                            onPan={onPan}
                            onPanEnd={onPanEnd}
                            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                        >
                            {gridItems.map((item, i) => (
                                <ProductCard
                                    key={i}
                                    product={item}
                                    x={springX}
                                    y={springY}
                                    indexX={item.indexX}
                                    indexY={item.indexY}
                                    totalCols={GRID_COLS}
                                    totalRows={GRID_ROWS}
                                    isDragging={isDragging}
                                    isMobile={isMobile}
                                />
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>

            {/* --- LENS --- */}
            <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0 backdrop-blur-[18px]"
                    style={{
                        maskImage: 'radial-gradient(circle at center, transparent 36%, black 92%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent 36%, black 92%)',
                    }}
                />
            </div>

            {/* --- MINIMAL UI --- */}
            <div className="absolute inset-0 z-[100] pointer-events-none flex flex-col justify-between px-4 md:px-10 py-6 md:py-8">
                <div className="flex justify-between items-start gap-4">
                    <Link to="/" className="pointer-events-auto text-[24px] md:text-[28px] font-brand tracking-tight block hover:opacity-70 transition-opacity">
                        NIRAKARA
                    </Link>
                    <div className="pointer-events-auto flex items-center gap-3 md:gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className={`${topButtonClass} ${isFiltersOpen ? 'opacity-100' : 'opacity-85 hover:opacity-100'} justify-between`}
                        >
                            <span>Filters</span>
                            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-none border border-black/25 px-1 text-[9px] font-semibold text-black">
                                {[
                                    filters.categories.length,
                                    filters.finishes.length,
                                    filters.featuredOnly ? 1 : 0,
                                    filters.maxPrice && priceStats.max && filters.maxPrice < priceStats.max ? 1 : 0,
                                ].reduce((a, b) => a + b, 0)}
                            </span>
                        </button>
                        <Link
                            to="/cart"
                            className={`${topButtonClass} opacity-85 hover:opacity-100 whitespace-nowrap justify-between flex`}
                        >
                            <span>Cart</span>
                            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-none border border-black/25 px-1 text-[9px] font-semibold text-black/70 opacity-70">
                                0
                            </span>
                        </Link>
                    </div>
                </div>

                <AnimatePresence>
                    {isFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18 }}
                            className="pointer-events-auto absolute top-20 right-0 md:right-10 px-4 md:px-0 w-full md:w-auto"
                        >
                            <div className="mx-auto md:ml-auto md:mr-0 w-full md:w-[380px] bg-white/95 backdrop-blur border border-black/30 shadow-2xl rounded-none p-5 flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black">Filters</span>
                                    <button
                                        onClick={clearFilters}
                                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-black hover:underline underline-offset-4"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold text-black/70 uppercase tracking-[0.18em]">Categories</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((cat) => {
                                            const active = filters.categories.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`px-3 py-2 border text-[10px] uppercase tracking-[0.18em] transition-colors ${
                                                        active
                                                            ? "border-black bg-black text-white shadow-sm"
                                                            : "border-black/25 text-black/70 hover:border-black/40 hover:text-black"
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {availableFinishes.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-black/70 uppercase tracking-[0.18em]">Finish</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableFinishes.map((finish) => {
                                                const active = filters.finishes.includes(finish);
                                                return (
                                                    <button
                                                        key={finish}
                                                        onClick={() => toggleFinish(finish)}
                                                        className={`px-3 py-2 border text-[10px] uppercase tracking-[0.18em] transition-colors ${
                                                            active
                                                                ? "border-black bg-black text-white shadow-sm"
                                                                : "border-black/25 text-black/70 hover:border-black/40 hover:text-black"
                                                        }`}
                                                    >
                                                        {finish}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {priceStats.max > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-black/70 uppercase tracking-[0.18em]">Price cap</span>
                                            <div className="flex items-center gap-2 text-[11px] text-black/80 font-mono">
                                                <span className="uppercase tracking-[0.18em] text-black/60">Up to</span>
                                                <input
                                                    type="number"
                                                    className="w-24 border border-black/25 px-2 py-1 text-[11px] bg-white focus:border-black/50 focus:outline-none rounded-none"
                                                    value={priceMaxValue}
                                                    min={priceStats.min}
                                                    max={priceStats.max}
                                                    onChange={(e) => updatePrice(Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min={priceStats.min}
                                            max={priceStats.max}
                                            step={Math.max(100, Math.round(priceStats.max / 50))}
                                            value={priceMaxValue}
                                            onChange={(e) => updatePrice(Number(e.target.value))}
                                            className="w-full h-2 appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(90deg, #0c0c0c ${pricePercent}%, #d6d1c8 ${pricePercent}%)`,
                                                border: "1px solid rgba(0,0,0,0.28)",
                                                borderRadius: 0,
                                            }}
                                        />
                                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-black/45">
                                            <span>LKR {priceStats.min.toLocaleString()}</span>
                                            <span>LKR {priceStats.max.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <input
                                                id="featured-only"
                                                type="checkbox"
                                                checked={filters.featuredOnly}
                                                onChange={() => setFilters((prev) => ({ ...prev, featuredOnly: !prev.featuredOnly }))}
                                                className="h-4 w-4 accent-black border-black/30"
                                            />
                                            <label htmlFor="featured-only" className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/70">
                                                Featured only
                                            </label>
                                        </div>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/60 hover:text-black"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
