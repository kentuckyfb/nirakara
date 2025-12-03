import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Helper to read JSON
async function readJson(file) {
    try {
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${file}:`, error);
        return null;
    }
}

// Helper to write JSON
async function writeJson(file, data) {
    try {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${file}:`, error);
        return false;
    }
}

// Routes

// Get Config (Filters, etc.)
app.get('/api/config', async (req, res) => {
    const config = await readJson(CONFIG_FILE);
    if (config) res.json(config);
    else res.status(500).json({ error: 'Failed to load config' });
});

// Get All Products
app.get('/api/products', async (req, res) => {
    const products = await readJson(PRODUCTS_FILE);
    if (products) res.json(products);
    else res.status(500).json({ error: 'Failed to load products' });
});

// Get Single Product
app.get('/api/products/:slug', async (req, res) => {
    const products = await readJson(PRODUCTS_FILE);
    if (!products) return res.status(500).json({ error: 'Failed to load products' });

    const product = products.find(p => p.slug === req.params.slug);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
});

// Admin Login (Simple)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Hardcoded for simplicity as requested
    if (email === 'admin@nirakara.com' && password === 'silver') {
        res.json({ token: 'admin-token-123', user: { email, name: 'Admin' } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware for Auth
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'admin-token-123') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Create Product with Image Upload
app.post('/api/products', authenticate, upload.single('image'), async (req, res) => {
    try {
        const products = await readJson(PRODUCTS_FILE);
        if (!products) return res.status(500).json({ error: 'Failed to load products' });

        const productData = { ...req.body };

        // Handle uploaded image
        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        // Parse arrays if they're strings
        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Convert price to number
        if (productData.priceLKR) {
            productData.priceLKR = Number(productData.priceLKR);
        }

        // Convert boolean
        if (productData.isFeatured) {
            productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        }

        const newProduct = {
            ...productData,
            id: productData.slug || Date.now().toString()
        };

        products.push(newProduct);

        if (await writeJson(PRODUCTS_FILE, products)) {
            res.status(201).json(newProduct);
        } else {
            res.status(500).json({ error: 'Failed to save product' });
        }
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Update Product with Image Upload
app.put('/api/products/:id', authenticate, upload.single('image'), async (req, res) => {
    try {
        const products = await readJson(PRODUCTS_FILE);
        if (!products) return res.status(500).json({ error: 'Failed to load products' });

        const index = products.findIndex(p => p.id === req.params.id || p.slug === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Product not found' });

        const productData = { ...req.body };

        // Handle uploaded image
        if (req.file) {
            productData.image = `/uploads/${req.file.filename}`;
        }

        // Parse arrays if they're strings
        if (typeof productData.images === 'string') {
            productData.images = productData.images.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof productData.highlights === 'string') {
            productData.highlights = productData.highlights.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Convert price to number
        if (productData.priceLKR) {
            productData.priceLKR = Number(productData.priceLKR);
        }

        // Convert boolean
        if (productData.isFeatured !== undefined) {
            productData.isFeatured = productData.isFeatured === 'true' || productData.isFeatured === true;
        }

        products[index] = { ...products[index], ...productData };

        if (await writeJson(PRODUCTS_FILE, products)) {
            res.json(products[index]);
        } else {
            res.status(500).json({ error: 'Failed to update product' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Delete Product
app.delete('/api/products/:id', authenticate, async (req, res) => {
    const products = await readJson(PRODUCTS_FILE);
    if (!products) return res.status(500).json({ error: 'Failed to load products' });

    const newProducts = products.filter(p => p.id !== req.params.id && p.slug !== req.params.id);

    if (await writeJson(PRODUCTS_FILE, newProducts)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
