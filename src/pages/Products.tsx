import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, PanInfo, useTransform } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate, Link } from "react-router-dom";
import { Product } from "@/types/product";

// --- Configuration ---
const ITEM_WIDTH = 300;
const ITEM_HEIGHT = 350;
const GAP = 0; // No gap for continuous grid lines
const DRAG_FACTOR = 1; // 1:1 movement for tactile feel

// --- Components ---

interface ProductCardProps {
    product: Product;
    x: any; // MotionValue
    y: any; // MotionValue
    indexX: number;
    indexY: number;
    totalCols: number;
    totalRows: number;
    isDragging: React.MutableRefObject<boolean>;
}

const ProductCard = ({ product, x, y, indexX, indexY, totalCols, totalRows, isDragging }: ProductCardProps) => {
    const navigate = useNavigate();
    const width = ITEM_WIDTH;
    const height = ITEM_HEIGHT;

    const baseX = (indexX - Math.floor(totalCols / 2)) * width;
    const baseY = (indexY - Math.floor(totalRows / 2)) * height;

    const getWrappedValue = (v: number, base: number, total: number) => {
        const offset = v + base;
        return ((offset + total / 2) % total + total) % total - total / 2;
    };

    const xPos = useTransform(x, (v: any) => {
        const wx = getWrappedValue(Number(v), baseX, totalCols * width);
        return wx + window.innerWidth / 2 - ITEM_WIDTH / 2;
    });

    const yPos = useTransform(y, (v: any) => {
        const wy = getWrappedValue(Number(v), baseY, totalRows * height);
        return wy + window.innerHeight / 2 - ITEM_HEIGHT / 2;
    });

    // 3D Perspective Rotation based on distance from focal point
    const rotateX = useTransform(y, (v: any) => {
        const wy = getWrappedValue(Number(v), baseY, totalRows * height);
        return (wy / 1000) * 15; // Subtle tilt based on vertical distance
    });

    const rotateY = useTransform(x, (v: any) => {
        const wx = getWrappedValue(Number(v), baseX, totalCols * width);
        return -(wx / 1000) * 15; // Subtle tilt based on horizontal distance
    });

    const scale = useTransform([x, y], ([vx, vy]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * width);
        const wy = getWrappedValue(Number(vy), baseY, totalRows * height);

        // Normalize distance: Treat width and height steps as equal units
        // Since height (350) is greater than width (300), we scale wy down 
        // to match the horizontal magnification rate.
        const wyNormalized = wy * (ITEM_WIDTH / ITEM_HEIGHT);
        const distance = Math.sqrt(wx * wx + wyNormalized * wyNormalized);

        const radius = 750;
        const norm = Math.min(distance / radius, 1);
        return 0.5 + 0.5 * Math.pow(Math.cos(norm * (Math.PI / 2)), 3.5);
    });

    const opacity = useTransform(scale, [0.5, 1], [0.6, 1]);
    const zIndex = useTransform(scale, s => Math.round(s * 1000));

    const detailsOpacity = useTransform(scale, [0.5, 0.8], [0.3, 1]);

    const handleClick = (e: React.MouseEvent) => {
        if (isDragging.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        navigate(`/product/${product.slug}`);
    };

    // Generate semi-stable archival metadata based on index
    const serialNumber = useMemo(() => `NIR-${(indexX + indexY * totalCols).toString().padStart(4, '0')}`, [indexX, indexY, totalCols]);
    const sector = useMemo(() => `SECTOR_${Math.floor(indexX / 3)}:ARCHIVE_${String.fromCharCode(65 + Math.floor(indexY / 3))}`, [indexX, indexY]);
    const materialCode = useMemo(() => ['MTL-01', 'MTL-02', 'MTL-03', 'TEX-08', 'GLS-11'][(indexX + indexY) % 5], [indexX, indexY]);

    return (
        <motion.div
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                x: xPos,
                y: yPos,
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                zIndex,
                perspective: 1000,
            }}
            className="flex items-center justify-center pointer-events-none p-4"
        >
            <motion.div
                style={{
                    scale,
                    opacity,
                    rotateX,
                    rotateY,
                    width: "100%",
                    height: "100%",
                }}
                className="flex flex-col items-center justify-center pointer-events-none transform-gpu bg-white/40 backdrop-blur-xl border-[0.5px] border-black/10 rounded-sm overflow-hidden group/card"
            >
                <div
                    onClick={handleClick}
                    className="block w-full h-full p-6 pointer-events-auto cursor-pointer flex flex-col items-center justify-between transition-colors duration-500 hover:bg-black/[0.02] active:bg-black/[0.04] appearance-none"
                    draggable={false}
                >
                    {/* Top Archival Header */}
                    <motion.div style={{ opacity: detailsOpacity }} className="w-full flex justify-between items-start font-mono text-[7px] uppercase tracking-widest text-black/40">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-black/60 font-bold">{serialNumber}</span>
                            <span>{sector}</span>
                        </div>
                        <div className="text-right flex flex-col gap-0.5">
                            <span className="italic">{product.category || "SPECIMEN"}</span>
                            <span>{materialCode}</span>
                        </div>
                    </motion.div>

                    {/* Image Section */}
                    <div className="w-full h-[150px] relative flex items-center justify-center">
                        {/* Internal Scanlines for images */}
                        <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-auto object-contain transition-transform duration-700 group-hover/card:scale-105"
                                draggable={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-black/10 font-mono text-[8px]">IMAGE_NOT_SYNCED</div>
                        )}
                    </div>

                    {/* Lower Editorial Content */}
                    <div className="w-full pt-4 border-t border-black/5 flex justify-between items-end">
                        <div className="flex flex-col gap-1 max-w-[70%] text-left">
                            <h3 className="font-brand text-[10px] uppercase tracking-[0.2em] leading-tight text-black/80 line-clamp-1">{product.name}</h3>
                            <div className="flex gap-2 font-mono text-[7px] text-black/30">
                                <span>BATCH_{product.id.substring(0, 4)}</span>
                                <span className="text-emerald-500/40">● VERIFIED</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono text-[9px] font-bold text-black/90 tabular-nums">LKR {product.priceLKR.toLocaleString()}</p>
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

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Mouse Tracking for Cursor-HUD
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 400, damping: 50, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const smoothMouseX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

    const GRID_COLS = 11;
    const GRID_ROWS = 11;

    // Background lighting parallax
    const bgX = useTransform(springX, v => (Number(v) * 0.05));
    const bgY = useTransform(springY, v => (Number(v) * 0.05));

    // Archival Coordinates
    const currentX = useTransform(x, v => Math.abs(Math.round(Number(v) / ITEM_WIDTH) % 100).toString().padStart(2, '0'));
    const currentY = useTransform(y, v => Math.abs(Math.round(Number(v) / ITEM_HEIGHT) % 100).toString().padStart(2, '0'));

    const [dispX, setDispX] = useState("00");
    const [dispY, setDispY] = useState("00");

    useEffect(() => {
        const unsubX = currentX.on("change", (v) => setDispX(v));
        const unsubY = currentY.on("change", (v) => setDispY(v));
        return () => { unsubX(); unsubY(); };
    }, [currentX, currentY]);

    // Stable Technical IDs for HUD
    const sessionId = useMemo(() => Math.random().toString(36).substring(7).toUpperCase(), []);
    const refId = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

    // Reactive Depth Telemetry
    const depth = useTransform([springX, springY], ([sx, sy]: any[]) => {
        // Find distance to center from current smoothed position
        const dx = Number(sx) % ITEM_WIDTH;
        const dy = Number(sy) % ITEM_HEIGHT;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const norm = Math.max(0, 1 - dist / 500);
        return (norm * 100).toFixed(1);
    });

    const [dispDepth, setDispDepth] = useState("00.0");
    useEffect(() => {
        const unsub = depth.on("change", setDispDepth);
        return unsub;
    }, [depth]);

    // Archive Scan Transition on load
    const [isBooting, setIsBooting] = useState(true);
    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => setIsBooting(false), 800);
        }
    }, [isLoading]);

    // Focal check for cursor label: Show when mouse is near screen center
    const showLabel = useTransform([mouseX, mouseY], ([mx, my]: any[]) => {
        const dx = Number(mx) - window.innerWidth / 2;
        const dy = Number(my) - window.innerHeight / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 300 ? 1 : 0;
    });

    const gridItems = useMemo(() => {
        if (!products.length) return [];
        const items = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const productIndex = (r * GRID_COLS + c) % products.length;
                items.push({
                    ...products[productIndex],
                    indexX: c,
                    indexY: r,
                });
            }
        }
        return items;
    }, [products]);

    const onPanStart = () => { isDragging.current = true; };
    const onPan = (event: any, info: PanInfo) => {
        x.set(x.get() + info.delta.x);
        y.set(y.get() + info.delta.y);
    };
    const onPanEnd = (event: any, info: PanInfo) => {
        setTimeout(() => { isDragging.current = false; }, 50);
        const width = ITEM_WIDTH;
        const height = ITEM_HEIGHT;
        const velX = info.velocity.x;
        const velY = info.velocity.y;
        const targetX = Math.round((x.get() + velX * 0.1) / width) * width;
        const targetY = Math.round((y.get() + velY * 0.1) / height) * height;
        x.set(targetX);
        y.set(targetY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="bg-[#f5f3ee] w-full h-screen overflow-hidden relative font-body selection:bg-none select-none"
        >
            {/* --- WORLD LAYER (Background & Grid) --- */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="absolute inset-[-10%] opacity-[0.4]"
                    style={{
                        x: bgX,
                        y: bgY,
                        backgroundImage: 'radial-gradient(circle, #000 0.5px, transparent 0.5px)',
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />
                <motion.div style={{ x: useTransform(bgX, v => Number(v) * 0.7), y: useTransform(bgY, v => Number(v) * 0.7) }} className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-[-20%] left-[-20%] w-[1000px] h-[1000px] bg-black/[0.03] rounded-full blur-[180px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-black/[0.03] rounded-full blur-[160px]" />
                </motion.div>

                {isBooting && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-[5000] bg-[#f5f3ee] flex flex-col items-center justify-center p-12 pointer-events-none"
                    >
                        <div className="w-full max-w-md space-y-8">
                            <div className="flex justify-between font-mono text-[9px] text-black/40 tracking-[0.3em]">
                                <span>ARCHIVAL_RECOVERY_PROTOCOL</span>
                                <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }}>[LOADING]</motion.span>
                            </div>
                            <div className="h-[1px] w-full bg-black/5 relative overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="absolute inset-0 bg-black/40"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-12 font-mono text-[7px] text-black/20 text-center">
                                <span>STREAMING_PIXELS_B01</span>
                                <span>SYNC_V_SYNC_AUTO</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {!isBooting && (
                    isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-2 h-2 bg-black animate-pulse" />
                        </div>
                    ) : (
                        <motion.div
                            onPanStart={onPanStart}
                            onPan={onPan}
                            onPanEnd={onPanEnd}
                            className="w-full h-full cursor-none touch-none"
                            style={{ x: 0, y: 0 }}
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
                                />
                            ))}
                        </motion.div>
                    )
                )}

                {/* Center Crosshair (World Space) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                    <div className="w-10 h-[1px] bg-black/40 absolute -translate-x-1/2" />
                    <div className="h-10 w-[1px] bg-black/40 absolute -translate-y-1/2" />
                </div>
            </div>

            {/* --- LENS / BLUR LAYER --- */}
            <div className="absolute inset-0 z-[10] pointer-events-none overflow-hidden">
                <div
                    className="absolute inset-0 backdrop-blur-[12px] bg-white/[0.02]"
                    style={{
                        maskImage: 'radial-gradient(circle at center, transparent 30%, black 85%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 85%)',
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.12)_100%)]" />
                <div className="absolute inset-0 opacity-[0.04]">
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: "200%" }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="w-full h-[40%] bg-gradient-to-b from-transparent via-black to-transparent"
                    />
                </div>
            </div>

            {/* --- HUD/GUI LAYER --- */}
            <div className="absolute inset-0 z-[1000] pointer-events-none flex flex-col justify-between p-8">
                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-black/10" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-black/10" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-black/10" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-black/10" />

                <div className="flex justify-between items-start">
                    <div className="pointer-events-auto">
                        <Link to="/" className="text-2xl font-brand tracking-tighter block hover:opacity-50 transition-opacity">NIRAKARA</Link>
                        <div className="mt-1 h-[1px] w-full bg-black/10 origin-left scale-x-50" />
                        <div className="mt-2 font-mono text-[7px] uppercase tracking-[0.4em] text-black/20 flex items-center gap-2">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-1.5 h-1.5 border border-black/40 border-t-transparent rounded-full" />
                            ARCHIVAL_ACTIVE_STREAM
                        </div>
                    </div>
                    <div className="flex gap-12 font-mono text-[9px] uppercase tracking-[0.4em] pointer-events-auto items-center">
                        <Link to="/shop" className="hover:line-through transition-all opacity-40 hover:opacity-100 italic">Archive_List</Link>
                        <Link to="/cart" className="hover:line-through transition-all opacity-40 hover:opacity-100">User_Cart [0]</Link>
                        <div className="w-8 h-8 border border-black/10 flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-black/5 scale-0 group-hover:scale-100 transition-transform" />
                            <span className="relative">?</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1 font-mono text-[9px] uppercase tracking-[0.25em] text-black/40">
                        <div className="text-[7px] text-black/20 flex gap-4 mb-1">
                            <span>GRID_STATUS: ACTIVE</span>
                            <span>Z_DEPTH: {dispDepth}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-black/10 font-bold">POS_FEED</span>
                            <span className="text-black/80 font-bold tabular-nums flex gap-3">
                                <div className="flex items-center gap-1 min-w-[40px]"><span className="text-[7px] text-black/20">X_</span><span>{dispX}</span></div>
                                <span className="text-black/10">/</span>
                                <div className="flex items-center gap-1 min-w-[40px]"><span className="text-[7px] text-black/20">Y_</span><span>{dispY}</span></div>
                            </span>
                        </div>
                        <div className="h-[2px] w-64 bg-black/5 relative overflow-hidden backdrop-blur-sm">
                            <motion.div style={{ x: useTransform(x, v => (Number(v) % 100) * 0.5) }} className="absolute inset-0 w-1/4 bg-black/60" />
                        </div>
                    </div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.5em] text-black/20 text-right flex flex-col gap-1 items-end">
                        <div className="flex items-center gap-2 mt-auto">
                            <span className="h-[1px] w-8 bg-black/10" />
                            SESSION: {sessionId} // REF_{refId}
                        </div>
                        <div className="text-emerald-500/40 text-[7px] font-bold tracking-[0.2em]">STATUS: LENS_CALIBRATED_EST</div>
                    </div>
                </div>
            </div>

            {/* --- CURSOR LAYER --- */}
            <motion.div
                style={{ x: smoothMouseX, y: smoothMouseY }}
                className="fixed top-0 left-0 z-[10000] pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            >
                <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <motion.div
                        style={{ opacity: showLabel }}
                        className="absolute left-6 whitespace-nowrap bg-black text-white px-3 py-1 text-[8px] font-brand uppercase tracking-[0.3em] backdrop-blur-md"
                    >
                        View Piece
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
