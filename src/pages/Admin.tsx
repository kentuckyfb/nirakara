import { useState, useRef } from "react";
import { useProducts, useAdminProducts } from "@/hooks/useProducts";
import { login } from "@/lib/api";
import { db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Trash2, Edit, LogOut, Plus, X, Package, Star } from "lucide-react";

export default function Admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("adminToken"));
    const { data: products, isLoading } = useProducts();
    const { createProduct, updateProduct, deleteProduct } = useAdminProducts();
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            setToken(res.token);
            localStorage.setItem("adminToken", res.token);
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("adminToken");
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await deleteProduct({ id, token: token! });
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("This will upload/overwrite products from the JSON file. Continue?")) {
            e.target.value = ""; // Reset input
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonContent = event.target?.result as string;
                const products = JSON.parse(jsonContent);

                if (!Array.isArray(products)) {
                    alert("Invalid JSON format. Expected an array of products.");
                    return;
                }

                const batch = writeBatch(db);
                let count = 0;

                products.forEach((product: any) => {
                    // Use slug as ID for consistency
                    const docRef = doc(db, "products", product.slug || product.id);
                    // Set default isVisible to true if not specified
                    if (product.isVisible === undefined) {
                        product.isVisible = true;
                    }
                    batch.set(docRef, product);
                    count++;
                });

                await batch.commit();
                alert(`Successfully uploaded ${count} products to Firebase! Refreshing...`);
                window.location.reload();
            } catch (error) {
                console.error("Upload failed:", error);
                alert("Upload failed. Check console for details.");
            }
        };
        reader.readAsText(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement);

        // Add image file if selected
        if (imageFile) {
            formData.set('image', imageFile);
        }

        try {
            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, product: formData, token: token! });
            } else {
                await createProduct({ product: formData, token: token! });
            }
            setEditingProduct(null);
            setImageFile(null);
            setImagePreview("");
            formElement.reset();
        } catch (error: any) {
            console.error("Save error:", error);
            alert(`Failed to save product: ${error?.response?.data?.error || error.message}`);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setImagePreview(product.image || "");
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview("");
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="space-y-1 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-t-lg">
                        <CardTitle className="text-2xl font-brand">Admin Login</CardTitle>
                        <CardDescription className="text-neutral-300">Enter your credentials to access the admin panel</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@nirakara.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
            <div className="container mx-auto p-4 md:p-8 max-w-[1800px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6 rounded-lg shadow-lg">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-brand flex items-center gap-3">
                            <Package className="w-8 h-8" />
                            Product Admin
                        </h1>
                        <p className="text-sm text-neutral-300 mt-1">Manage your product catalogue</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleBulkUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                title="Upload JSON"
                            />
                            <Button variant="outline" className="w-full md:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload JSON
                            </Button>
                        </div>
                        <Button onClick={handleLogout} variant="outline" className="flex-1 md:flex-none bg-white/10 border-white/20 text-white hover:bg-white/20">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Product Form - Now First */}
                    <div className="xl:col-span-1 order-1 xl:order-2">
                        <Card className="sticky top-4 shadow-xl border-2 border-neutral-200">
                            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
                                <CardTitle className="flex items-center justify-between text-xl">
                                    <span className="flex items-center gap-2">
                                        {editingProduct ? (
                                            <>
                                                <Edit className="w-5 h-5 text-blue-600" />
                                                Edit Product
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-5 h-5 text-green-600" />
                                                Add New Product
                                            </>
                                        )}
                                    </span>
                                    {editingProduct && (
                                        <Button size="sm" variant="ghost" onClick={handleCancel} className="hover:bg-red-100">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {editingProduct ? "Update product details below" : "Create a new product for your catalogue"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-[calc(100vh-12rem)] overflow-y-auto pt-6">
                                <form onSubmit={handleSave} className="space-y-5">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">Product Image *</Label>
                                        <div
                                            className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-lg shadow-md" />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 shadow-lg"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImageFile(null);
                                                            setImagePreview("");
                                                        }}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="py-10">
                                                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                                                    <p className="text-sm font-medium text-neutral-700">Click to upload image</p>
                                                    <p className="text-xs text-neutral-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold">Product Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={editingProduct?.name}
                                            placeholder="U-01 / Ritual Ring"
                                            required
                                            className="border-neutral-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="unitCode" className="text-sm font-semibold">Unit Code *</Label>
                                            <Input
                                                id="unitCode"
                                                name="unitCode"
                                                defaultValue={editingProduct?.unitCode}
                                                placeholder="U-01"
                                                required
                                                className="border-neutral-300 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="slug" className="text-sm font-semibold">Slug *</Label>
                                            <Input
                                                id="slug"
                                                name="slug"
                                                defaultValue={editingProduct?.slug}
                                                placeholder="ritual-ring-001"
                                                required
                                                className="border-neutral-300 font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="text-sm font-semibold">Category *</Label>
                                            <select
                                                id="category"
                                                name="category"
                                                defaultValue={editingProduct?.category || ""}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                required
                                            >
                                                <option value="">Select category...</option>
                                                <option value="ring">Ring</option>
                                                <option value="chain">Chain</option>
                                                <option value="bracelet">Bracelet</option>
                                                <option value="ear-cuff">Ear Cuff</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="priceLKR" className="text-sm font-semibold">Price (LKR) *</Label>
                                            <Input
                                                id="priceLKR"
                                                name="priceLKR"
                                                type="number"
                                                defaultValue={editingProduct?.priceLKR}
                                                placeholder="9500"
                                                required
                                                className="border-neutral-300 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDescription" className="text-sm font-semibold">Short Description</Label>
                                        <Textarea
                                            id="shortDescription"
                                            name="shortDescription"
                                            defaultValue={editingProduct?.shortDescription}
                                            placeholder="Hammered silver with intentional chaos..."
                                            rows={2}
                                            className="border-neutral-300 resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-semibold">Full Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            defaultValue={editingProduct?.description}
                                            placeholder="A statement ring with rough, textured surfaces..."
                                            rows={3}
                                            className="border-neutral-300 resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="finish" className="text-sm font-semibold">Finish</Label>
                                            <select
                                                id="finish"
                                                name="finish"
                                                defaultValue={editingProduct?.finish || ""}
                                                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                <option value="">Select finish...</option>
                                                <option value="polished">Polished</option>
                                                <option value="brushed">Matte/Brushed</option>
                                                <option value="distressed">Oxidized/Distressed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weight" className="text-sm font-semibold">Weight</Label>
                                            <Input
                                                id="weight"
                                                name="weight"
                                                defaultValue={editingProduct?.weight}
                                                placeholder="8g"
                                                className="border-neutral-300 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        {/* Hidden input ensures 'false' is sent when checkbox is unchecked */}
                                        <input type="hidden" name="isFeatured" value="false" />
                                        <input
                                            type="checkbox"
                                            id="isFeatured"
                                            name="isFeatured"
                                            value="true"
                                            defaultChecked={editingProduct?.isFeatured}
                                            className="rounded w-5 h-5 border-amber-300"
                                        />
                                        <Label htmlFor="isFeatured" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                                            <Star className="w-4 h-4 text-amber-600" />
                                            Featured Product (Shows in top slider)
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        {/* Hidden input ensures 'false' is sent when checkbox is unchecked */}
                                        <input type="hidden" name="isVisible" value="false" />
                                        <input
                                            type="checkbox"
                                            id="isVisible"
                                            name="isVisible"
                                            value="true"
                                            defaultChecked={editingProduct?.isVisible ?? true}
                                            className="rounded w-5 h-5 border-green-300"
                                        />
                                        <Label htmlFor="isVisible" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Visible on Website (Uncheck to hide product)
                                        </Label>
                                    </div>

                                    <Separator />

                                    <div className="flex gap-3 pt-2">
                                        <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                            {editingProduct ? (
                                                <>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Update Product
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Product
                                                </>
                                            )}
                                        </Button>
                                        {editingProduct && (
                                            <Button type="button" variant="outline" onClick={handleCancel} className="border-neutral-300">
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products List - Now Second */}
                    <div className="xl:col-span-2 order-2 xl:order-1">
                        <Card className="shadow-xl border-2 border-neutral-200">
                            <CardHeader className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">Product Catalogue</CardTitle>
                                        <CardDescription className="mt-1">
                                            {products?.length || 0} product{products?.length !== 1 ? 's' : ''} in your inventory
                                        </CardDescription>
                                    </div>
                                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                                        {products?.filter((p: any) => p.isFeatured).length || 0} Featured
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {isLoading ? (
                                    <div className="text-center py-16">
                                        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-neutral-500">Loading products...</p>
                                    </div>
                                ) : products && products.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {products.map((product: any) => (
                                            <div
                                                key={product.id}
                                                className="group relative border-2 border-neutral-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all bg-white"
                                            >
                                                {product.isFeatured && (
                                                    <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Featured
                                                    </div>
                                                )}
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                                                        {product.image && (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-lg truncate group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                                        <p className="text-sm text-neutral-500 font-mono">{product.unitCode}</p>
                                                        <p className="text-xs text-neutral-400 mt-1 capitalize">{product.category}</p>
                                                        <p className="font-mono text-sm font-bold mt-2 text-green-700">LKR {product.priceLKR?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-200">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(product)}
                                                        className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(product.id)}
                                                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <Package className="w-16 h-16 mx-auto text-neutral-300 mb-4" />
                                        <p className="text-neutral-500 font-medium">No products found</p>
                                        <p className="text-sm text-neutral-400 mt-1">Create your first product to get started</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
