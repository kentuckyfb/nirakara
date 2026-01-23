import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, PanInfo, useTransform, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Product } from "@/types/product";
import { SlidersHorizontal, ShoppingBag, Tag, Gem, Coins, MessageSquare } from "lucide-react";

// --- Configuration ---
const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 288;
const GAP = 70; // Slightly more spacing between cards
const DRAG_FACTOR = 1;

// --- Components ---

interface ProductCardProps {
    product: Product;
    x: any;
    y: any;
    zoom: any;
    indexX: number;
    indexY: number;
    totalCols: number;
    totalRows: number;
    isDragging: React.MutableRefObject<boolean>;
    focusedSlug?: string | null;
    isMobile: boolean;
}

const ProductCard = ({ product, x, y, zoom, indexX, indexY, totalCols, totalRows, isDragging, focusedSlug, isMobile }: ProductCardProps) => {
    const navigate = useNavigate();
    const width = ITEM_WIDTH;
    const height = ITEM_HEIGHT;
    const currentGap = GAP;
    const isFocused = focusedSlug === product.slug;

    const baseX = (indexX - Math.floor(totalCols / 2)) * (width + currentGap);
    const baseY = (indexY - Math.floor(totalRows / 2)) * (height + currentGap);

    const sphereRadius = 1100;
    const tiltScale = 0.78;
    const twistMax = 4.5;
    const depthScale = 900;
    const focusTightness = 3.6;
    const fisheyeK = 0.16;

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

    const xPos = useTransform([x, y, zoom], ([vx, vy, zoomV]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * (width + currentGap));
        const wy = getWrappedValue(Number(vy), baseY, totalRows * (height + currentGap));
        const { fx } = applyFisheye(wx, wy);
        const distanceScale = isMobile ? (0.45 + 0.55 * zoomV) : 1;
        const heightLift = isMobile ? (1 - zoomV) * 60 : 0;
        return fx * zoomV * distanceScale + window.innerWidth / 2 - width / 2;
    });

    const yPos = useTransform([x, y, zoom], ([vx, vy, zoomV]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * (width + currentGap));
        const wy = getWrappedValue(Number(vy), baseY, totalRows * (height + currentGap));
        const { fy } = applyFisheye(wx, wy);
        const distanceScale = isMobile ? (0.45 + 0.55 * zoomV) : 1;
        const heightLift = isMobile ? (1 - zoomV) * 60 : 0;
        return fy * zoomV * distanceScale + window.innerHeight / 2 - height / 2 - heightLift;
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
    const scale = useTransform([x, y, zoom], ([vx, vy, zoomV]: any[]) => {
        const { distance2D } = getSphereMetrics(vx, vy);
        const bumpRadius = sphereRadius * 0.4;
        const t = Math.max(0, 1 - distance2D / bumpRadius);
        const centerBump = 0.36 * Math.pow(t, 1.2); // larger center card

        const norm = Math.min(distance2D / (sphereRadius * 1.05), 1);
        const depthFalloff = 0.12 * norm;

        const baseScale = Math.max(0.86, 1 - depthFalloff + centerBump);
        return isMobile ? baseScale * zoomV : baseScale;
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
                className="w-full h-full flex flex-col pointer-events-none overflow-hidden relative"
            >
                <div
                    onClick={handleClick}
                    className="block w-full h-full pointer-events-auto cursor-pointer flex flex-col appearance-none"
                    draggable={false}
                >
                    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                draggable={false}
                            />
                        ) : (
                            <div className="text-black/30 font-mono text-[10px] uppercase tracking-[0.2em]">Image pending</div>
                        )}
                        <div className="hidden md:flex absolute bottom-3 left-3 right-3 flex-col gap-1">
                            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-black/55">
                                <span className="truncate">{product.unitCode || product.category}</span>
                                <span className="whitespace-nowrap">LKR {product.priceLKR.toLocaleString()}</span>
                            </div>
                            <div className="text-[11px] font-brand uppercase tracking-[0.12em] text-black/80 leading-tight break-words">
                                {product.name}
                            </div>
                            {isFocused && !isMobile && (
                                <div className="mt-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.3em] text-black/60">
                                    <motion.div
                                        key={`${product.slug}-inquire`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="flex items-center gap-2"
                                    >
                                        <Link
                                            to={`/contact?product=${encodeURIComponent(product.unitCode || product.name)}`}
                                            className="hover:text-black transition-colors"
                                        >
                                            Inquire
                                        </Link>
                                        <span className="inline-flex items-center gap-1">
                                            <span className="h-[1px] w-10 bg-black/35" />
                                            <span className="h-1.5 w-1.5 rounded-full border border-black/40" />
                                        </span>
                                    </motion.div>
                                    <motion.div
                                        key={`${product.slug}-buy`}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full border border-black/40" />
                                            <span className="h-[1px] w-10 bg-black/35" />
                                        </span>
                                        <Link
                                            to={`/product/${product.slug}`}
                                            className="hover:text-black transition-colors"
                                        >
                                            Buy
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </div>
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
    const [focusedProduct, setFocusedProduct] = useState<Product | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const zoomBase = useMotionValue(1);
    const zoom = useSpring(zoomBase, { stiffness: 260, damping: 36, mass: 1 });

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

    useEffect(() => {
        if (!filteredProducts.length) {
            setFocusedProduct(null);
            return;
        }
        setFocusedProduct((prev) => prev ?? filteredProducts[0]);
    }, [filteredProducts]);

    const springConfig = { stiffness: 400, damping: 50, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const GRID_COLS = 11;
    const GRID_ROWS = 11;

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

    useEffect(() => {
        const getIsMobile = () =>
            window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
        const updateMobile = () => setIsMobile(getIsMobile());
        updateMobile();
        const pointerQuery = window.matchMedia("(pointer: coarse)");
        if (pointerQuery.addEventListener) {
            pointerQuery.addEventListener("change", updateMobile);
        } else {
            pointerQuery.addListener(updateMobile);
        }
        window.addEventListener("resize", updateMobile);
        return () => {
            if (pointerQuery.addEventListener) {
                pointerQuery.removeEventListener("change", updateMobile);
            } else {
                pointerQuery.removeListener(updateMobile);
            }
            window.removeEventListener("resize", updateMobile);
        };
    }, []);

    useEffect(() => {
        zoomBase.set(isMobile && isInteracting ? 0.55 : 1);
    }, [isMobile, isInteracting, zoomBase]);

    const onPanStart = () => {
        isDragging.current = true;
        if (isMobile) setIsInteracting(true);
    };
    const onPan = (event: any, info: PanInfo) => {
        x.set(x.get() + info.delta.x);
        y.set(y.get() + info.delta.y);
    };
    const getWrappedValue = (v: number, base: number, total: number) => {
        const offset = v + base;
        return ((offset + total / 2) % total + total) % total - total / 2;
    };
    const getClosestProductAtPosition = (posX: number, posY: number) => {
        if (!gridItems.length) return null;
        const totalW = GRID_COLS * (ITEM_WIDTH + GAP);
        const totalH = GRID_ROWS * (ITEM_HEIGHT + GAP);
        let best: { product: Product; distance: number } | null = null;

        gridItems.forEach((item) => {
            const baseX = (item.indexX - Math.floor(GRID_COLS / 2)) * (ITEM_WIDTH + GAP);
            const baseY = (item.indexY - Math.floor(GRID_ROWS / 2)) * (ITEM_HEIGHT + GAP);
            const wx = getWrappedValue(posX, baseX, totalW);
            const wy = getWrappedValue(posY, baseY, totalH);
            const distance = Math.sqrt(wx * wx + wy * wy);
            if (!best || distance < best.distance) {
                best = { product: item, distance };
            }
        });

        return best?.product ?? null;
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
        const closest = getClosestProductAtPosition(targetX, targetY);
        if (closest) {
            setFocusedProduct(closest);
        }
        if (isMobile) {
            window.setTimeout(() => setIsInteracting(false), 280);
        }
    };

    const topButtonClass = "transition-colors flex items-center justify-center h-9 w-9 border border-black/20 bg-transparent text-black/60 hover:text-black hover:border-black/50 rounded-none";

    return (
        <div className="bg-[hsl(var(--color-bg))] w-full h-[100svh] overflow-hidden relative font-body selection:bg-none select-none">
            <div className="absolute inset-0 bg-[hsl(var(--color-bg))]" />
            {/* --- WORLD LAYER --- */}
            <div
                className="absolute inset-0 z-0"
                style={{ perspective: "1700px", perspectiveOrigin: "50% 50%" }}
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
                            linear-gradient(135deg, hsl(var(--color-bg)) 0%, hsl(var(--color-bg)) 100%)
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
                                    zoom={zoom}
                                    indexX={item.indexX}
                                    indexY={item.indexY}
                                    totalCols={GRID_COLS}
                                    totalRows={GRID_ROWS}
                                    isDragging={isDragging}
                                    focusedSlug={focusedProduct?.slug}
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
                    className="absolute inset-0 backdrop-blur-[30px]"
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
                    <div className="pointer-events-auto flex items-center gap-2 md:gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black/70">
                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            aria-label="Filters"
                            className={`${topButtonClass} ${isFiltersOpen ? 'opacity-100' : 'opacity-85 hover:opacity-100'} relative`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="absolute -right-1 -top-1 text-[9px] font-semibold text-black">
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
                            aria-label="Cart"
                            className={`${topButtonClass} opacity-85 hover:opacity-100 relative`}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            <span className="absolute -right-1 -top-1 text-[9px] font-semibold text-black/70 opacity-70">0</span>
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
                            <div className="mx-auto md:ml-auto md:mr-0 w-full md:w-[360px] bg-[#f7f5ef]/85 backdrop-blur-md border border-black/15 rounded-none p-5 flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-black/70">Filters</span>
                                    <button
                                        onClick={clearFilters}
                                        className="text-[9px] font-mono uppercase tracking-[0.3em] text-black/60 hover:text-black"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-black/60 uppercase tracking-[0.28em]">Categories</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((cat) => {
                                            const active = filters.categories.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`px-3 py-2 border text-[9px] uppercase tracking-[0.28em] transition-colors ${
                                                        active
                                                            ? "border-black/70 text-black"
                                                            : "border-black/20 text-black/50 hover:border-black/40 hover:text-black/70"
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
                                            <span className="text-[10px] font-semibold text-black/60 uppercase tracking-[0.28em]">Finish</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {availableFinishes.map((finish) => {
                                                const active = filters.finishes.includes(finish);
                                                return (
                                                    <button
                                                        key={finish}
                                                        onClick={() => toggleFinish(finish)}
                                                        className={`px-3 py-2 border text-[9px] uppercase tracking-[0.28em] transition-colors ${
                                                            active
                                                                ? "border-black/70 text-black"
                                                                : "border-black/20 text-black/50 hover:border-black/40 hover:text-black/70"
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
                                            <span className="text-[10px] font-semibold text-black/60 uppercase tracking-[0.28em]">Price cap</span>
                                            <div className="flex items-center gap-2 text-[10px] text-black/70 font-mono">
                                                <span className="uppercase tracking-[0.28em] text-black/50">Up to</span>
                                                <input
                                                    type="number"
                                                    className="w-24 border border-black/20 px-2 py-1 text-[10px] bg-transparent focus:border-black/50 focus:outline-none rounded-none"
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
                                                border: "1px solid rgba(0,0,0,0.2)",
                                                borderRadius: 0,
                                            }}
                                        />
                                        <div className="flex justify-between text-[9px] font-mono uppercase tracking-[0.28em] text-black/45">
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
                                            <label htmlFor="featured-only" className="text-[9px] font-mono uppercase tracking-[0.3em] text-black/60">
                                                Featured only
                                            </label>
                                        </div>
                                    <button
                                        onClick={() => setIsFiltersOpen(false)}
                                        className="text-[9px] font-mono uppercase tracking-[0.3em] text-black/60 hover:text-black"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pointer-events-auto flex justify-center md:hidden">
                    {focusedProduct && !isInteracting && (
                        <div className="text-center px-6 py-2 bg-transparent">
                            <p className="text-[9px] uppercase tracking-[0.45em] text-black/40 font-mono flex items-center justify-center gap-2">
                                <Tag className="h-3 w-3" />
                                {focusedProduct.unitCode || focusedProduct.name}
                                <span className="text-black/25">·</span>
                                <Gem className="h-3 w-3" />
                                {focusedProduct.category}
                            </p>
                            <h2 className="mt-2 text-sm font-brand uppercase tracking-[0.18em] text-black">
                                {focusedProduct.name}
                            </h2>
                            <p className="mt-3 text-base font-semibold text-black">
                                LKR {focusedProduct.priceLKR.toLocaleString()}
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <div className="h-px w-8 bg-black/10" />
                                <p className="text-[8px] uppercase tracking-[0.5em] text-black/30">Not Available Online</p>
                                <div className="h-px w-8 bg-black/10" />
                            </div>
                            <div className="mt-3 flex items-center justify-center gap-4">
                                <Link
                                    to={`/contact?product=${encodeURIComponent(focusedProduct.unitCode || focusedProduct.name)}`}
                                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-black/50 hover:text-black underline underline-offset-4 decoration-black/20 hover:decoration-black/50 transition-all duration-300"
                                >
                                    <MessageSquare className="h-3 w-3" />
                                    Inquire
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
