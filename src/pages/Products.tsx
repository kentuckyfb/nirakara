import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, PanInfo, useTransform } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate, Link } from "react-router-dom";
import { Product } from "@/types/product";

// --- Configuration ---
const ITEM_WIDTH = 400;
const ITEM_HEIGHT = 550;
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

    // Base position relative to the logical grid center
    const baseX = (indexX - Math.floor(totalCols / 2)) * width;
    const baseY = (indexY - Math.floor(totalRows / 2)) * height;

    // Wrapping logic: based on current offset v
    const getWrappedValue = (v: number, base: number, total: number) => {
        const offset = v + base;
        return ((offset + total / 2) % total + total) % total - total / 2;
    };

    // Actual Screen Position: Offset (Camera) + Base + Centering math
    // We use window.innerWidth/Height directly in the transform to ensure it stays anchored to the screen center
    const xPos = useTransform(x, (v: any) => {
        const wx = getWrappedValue(Number(v), baseX, totalCols * width);
        return wx + window.innerWidth / 2 - ITEM_WIDTH / 2;
    });

    const yPos = useTransform(y, (v: any) => {
        const wy = getWrappedValue(Number(v), baseY, totalRows * height);
        return wy + window.innerHeight / 2 - ITEM_HEIGHT / 2;
    });

    // Magnification: based on wrapped distance from center (0,0)
    // IMPORTANT: The math here (wx, wy) MUST match the xPos/yPos logic exactly
    const scale = useTransform([x, y], ([vx, vy]: any[]) => {
        const wx = getWrappedValue(Number(vx), baseX, totalCols * width);
        const wy = getWrappedValue(Number(vy), baseY, totalRows * height);
        const distance = Math.sqrt(wx * wx + wy * wy);

        // Focal peak magnification
        const radius = 500;
        const norm = Math.min(distance / radius, 1);
        // Cosine power 6 for a balanced focus (very targeted center product)
        return 0.5 + 0.5 * Math.pow(Math.cos(norm * (Math.PI / 2)), 6);
    });

    const opacity = useTransform(scale, [0.5, 1], [0.4, 1]);
    const zIndex = useTransform(scale, s => Math.round(s * 1000));

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
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                zIndex,
            }}
            className="flex items-center justify-center pointer-events-none border border-black/[0.04] bg-[#f5f3ee] overflow-hidden"
        >
            <motion.div
                style={{
                    scale,
                    opacity,
                    width: "100%",
                    height: "100%",
                }}
                className="flex flex-col items-center justify-center pointer-events-none transform-gpu"
            >
                <div
                    onClick={handleClick}
                    className="block w-full h-full p-12 pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-opacity hover:opacity-80 appearance-none"
                    draggable={false}
                >
                    <div className="w-full h-[250px] mb-8 overflow-hidden relative flex items-center justify-center bg-black/5">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-black/20 font-mono text-xs">NO IMAGE</div>
                        )}
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-brand text-sm uppercase tracking-widest">{product.name}</h3>
                        <div className="flex flex-col items-center gap-1">
                            <p className="font-mono text-[10px] text-black/50">{product.unitCode}</p>
                            <p className="font-mono text-xs font-bold">LKR {product.priceLKR.toLocaleString()}</p>
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

    // Camera offset (Logical pixels relative to central item being at center)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring values for tactical movement
    const springConfig = { stiffness: 400, damping: 50, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Grid Scale
    const GRID_COLS = 7;
    const GRID_ROWS = 7;

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

    // Stationary container management (Prevents double-drag)
    const onPanStart = () => {
        isDragging.current = true;
    };

    const onPan = (event: any, info: PanInfo) => {
        // Direct natural movement (1:1 with cursor)
        x.set(x.get() + info.delta.x);
        y.set(y.get() + info.delta.y);
    };

    const onPanEnd = (event: any, info: PanInfo) => {
        setTimeout(() => { isDragging.current = false; }, 50);

        const width = ITEM_WIDTH;
        const height = ITEM_HEIGHT;

        // Force snap to center based on momentum
        const velX = info.velocity.x;
        const velY = info.velocity.y;

        // Predict where it should land and lock to nearest grid cell center
        const targetX = Math.round((x.get() + velX * 0.1) / width) * width;
        const targetY = Math.round((y.get() + velY * 0.1) / height) * height;

        x.set(targetX);
        y.set(targetY);
    };

    return (
        <div className="bg-[#f5f3ee] w-full h-screen overflow-hidden relative font-body selection:bg-black selection:text-white">
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-black/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-black/5 rounded-full blur-[120px]" />
            </div>

            <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-start pointer-events-none">
                <Link to="/" className="text-2xl font-brand tracking-tighter pointer-events-auto">
                    NIRAKARA
                </Link>
                <div className="flex gap-4 pointer-events-auto">
                    <Link to="/shop" className="text-xs uppercase tracking-widest hover:underline">Archive</Link>
                    <Link to="/cart" className="text-xs uppercase tracking-widest hover:underline">Cart</Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="w-2 h-2 bg-black animate-ping" />
                </div>
            ) : (
                <motion.div
                    onPanStart={onPanStart}
                    onPan={onPan}
                    onPanEnd={onPanEnd}
                    className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                    style={{ x: 0, y: 0 }} // CRITICAL: Stationary parent
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
            )}

            {/* Subtle center marker for UX (optional) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-black/10 rounded-full pointer-events-none" />
        </div>
    );
}
