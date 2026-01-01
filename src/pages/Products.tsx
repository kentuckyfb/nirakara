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
    centerX: number;
    centerY: number;
    isDragging: React.MutableRefObject<boolean>;
}

const ProductCard = ({ product, x, y, indexX, indexY, totalCols, totalRows, centerX, centerY, isDragging }: ProductCardProps) => {
    const navigate = useNavigate();

    // Calculate the absolute position of this card based on the grid offset (x, y)
    const width = ITEM_WIDTH + GAP;
    const height = ITEM_HEIGHT + GAP;

    // Base position in the grid
    const baseX = (indexX - Math.floor(totalCols / 2)) * width;
    const baseY = (indexY - Math.floor(totalRows / 2)) * height;

    // Transformed position (wrapping)
    const xPos = useTransform(x, (latestX: number) => {
        const offset = latestX + baseX;
        const totalWidth = totalCols * width;
        // Wrap logic:
        const wrapped = ((offset + totalWidth / 2) % totalWidth + totalWidth) % totalWidth - totalWidth / 2;
        return wrapped + centerX;
    });

    const yPos = useTransform(y, (latestY: number) => {
        const offset = latestY + baseY;
        const totalHeight = totalRows * height;
        const wrapped = ((offset + totalHeight / 2) % totalHeight + totalHeight) % totalHeight - totalHeight / 2;
        return wrapped + centerY;
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
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                zIndex: 1,
                originX: 0.5,
                originY: 0.5,
            }}
            className="flex flex-col items-center justify-center pointer-events-none border-r border-b border-black/10 bg-[#f5f3ee]"
        >
            <div
                onClick={handleClick}
                className="block w-full h-full p-6 pointer-events-auto cursor-pointer flex flex-col transition-opacity hover:opacity-80"
                draggable={false}
            >
                {/* Image Container */}
                <div className="w-full h-[400px] mb-4 overflow-hidden relative flex items-center justify-center bg-black/5">
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

                {/* Text Content */}
                <div className="text-center space-y-2">
                    <h3 className="font-brand text-sm uppercase tracking-widest">{product.name}</h3>
                    <div className="flex flex-col items-center gap-1">
                        <p className="font-mono text-[10px] text-black/50">{product.unitCode}</p>
                        <p className="font-mono text-xs font-bold">LKR {product.priceLKR.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default function Products() {
    const { data: products = [], isLoading } = useProducts();
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // Grid State
    const [center, setCenter] = useState({ x: 0, y: 0 });

    // Motion Values for the grid offset
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for snapping
    const springConfig = { stiffness: 100, damping: 20, mass: 1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    useEffect(() => {
        if (containerRef.current) {
            setCenter({
                x: containerRef.current.offsetWidth / 2,
                y: containerRef.current.offsetHeight / 2,
            });
        }

        const handleResize = () => {
            if (containerRef.current) {
                setCenter({
                    x: containerRef.current.offsetWidth / 2,
                    y: containerRef.current.offsetHeight / 2,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prepare grid items
    const GRID_COLS = 9;
    const GRID_ROWS = 9;

    const gridItems = useMemo(() => {
        if (!products.length) return [];

        const items = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                // Map grid position to product index
                const productIndex = (r * GRID_COLS + c) % products.length;
                items.push({
                    ...products[productIndex],
                    gridId: `${r}-${c}`,
                    indexX: c,
                    indexY: r,
                });
            }
        }
        return items;
    }, [products]);

    const onDragStart = () => {
        isDragging.current = true;
    };

    const onDrag = (event: any, info: PanInfo) => {
        x.set(x.get() + info.delta.x * DRAG_FACTOR);
        y.set(y.get() + info.delta.y * DRAG_FACTOR);
    };

    const onDragEnd = (event: any, info: PanInfo) => {
        // crucial: short timeout to prevent immediate click firing
        setTimeout(() => {
            isDragging.current = false;
        }, 50);

        const width = ITEM_WIDTH + GAP;
        const height = ITEM_HEIGHT + GAP;

        // Current values
        const currentX = x.get();
        const currentY = y.get();

        // Velocity
        const velX = info.velocity.x;
        const velY = info.velocity.y;

        // Predicted stop point
        const predictedX = currentX + velX * 0.2;
        const predictedY = currentY + velY * 0.2;

        // Snap target
        const snapX = Math.round(predictedX / width) * width;
        const snapY = Math.round(predictedY / height) * height;

        // Update motion values - the springs will handle the animation
        x.set(snapX);
        y.set(snapY);
    };

    return (
        <div className="bg-[#f5f3ee] w-full h-screen overflow-hidden relative font-body selection:bg-black selection:text-white">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
            </div>

            {/* Header / Nav (Absolute) */}
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
                    ref={containerRef}
                    className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                    drag
                    dragMomentum={false}
                    onDragStart={onDragStart}
                    onDrag={onDrag}
                    onDragEnd={onDragEnd}
                    style={{ x: 0, y: 0 }}
                >
                    {/* Grid Items */}
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
                            centerX={center.x}
                            centerY={center.y}
                            isDragging={isDragging}
                        />
                    ))}
                </motion.div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none z-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">Drag to Explore</p>
            </div>
        </div>
    );
}
