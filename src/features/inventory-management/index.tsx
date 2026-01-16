import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronRight, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';
import { useSelector } from 'react-redux';

const InventoryDashboard = () => {
  type Category = {
    _id: string;
    name: string;
    subcategories?: { _id: string; name: string }[];
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  type Product = {
    _id: string;
    productName: string;
    brand?: string;
    baseSku?: string;
    defaultImages?: { url: string }[];
    variants?: Variant[];
  };

  type Variant = {
    _id: string;
    variantSku?: string;
    variantAttributes?: { [key: string]: string };
    finalPrice?: number;
    actualPrice?: number;
    discountPercent?: number;
    stockQuantity?: number;
    isActive?: boolean;
    variantsImageUrls?: { url: string }[];
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [expandedProducts, setExpandedProducts] = useState(new Set<string>());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = `${import.meta.env.VITE_PUBLIC_API_URL}`;
  const token = useSelector((state: any) => state?.auth?.token);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update filtered categories whenever categories or searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredCategories(
        categories.filter(cat => cat.name.toLowerCase().includes(term))
      );
    }
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/categories/get-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        setFilteredCategories(data.data); // Initialize filtered list
      }
    } catch (err: any) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/products/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
        setSelectedCategory(categoryId);
      }
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (quantity < 10)
      return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getTotalStock = (variants: Variant[]) => {
    return variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="text-sm text-gray-500">Track and manage your product inventory</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {loading && !selectedCategory ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => fetchProductsByCategory(cat._id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === cat._id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{cat.name}</div>
                        {cat.subcategories && (
                          <div className="text-xs text-gray-500 mt-1">
                            {cat.subcategories.length} subcategories
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products & Variants */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {!selectedCategory ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a category to view products</p>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found in this category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const isExpanded = expandedProducts.has(product._id);
                  const totalStock = getTotalStock(product.variants || []);
                  const stockStatus = getStockStatus(totalStock);

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm border overflow-hidden"
                    >
                      {/* Product Header */}
                      <div
                        onClick={() => toggleProduct(product._id)}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {product.defaultImages?.[0] && (
                              <img
                                src={product.defaultImages[0].url}
                                alt={product.productName}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                                <h3 className="font-semibold text-gray-900">
                                  {product.productName}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  SKU: {product.baseSku}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color} font-medium`}
                                >
                                  {stockStatus.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Total Stock</div>
                            <div className="text-2xl font-bold text-gray-900">{totalStock}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {product.variants?.length || 0} variants
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Variants Table */}
                      {isExpanded && (
                        <div className="border-t bg-gray-50">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    Image
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    SKU
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    Attributes
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    Stock
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {product.variants?.map((variant) => {
                                  const variantStock = getStockStatus(variant.stockQuantity || 0);
                                  return (
                                    <tr key={variant._id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3">
                                        {variant.variantsImageUrls?.[0] && (
                                          <img
                                            src={variant.variantsImageUrls[0].url}
                                            alt="Variant"
                                            className="w-12 h-12 object-cover rounded border"
                                          />
                                        )}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-sm font-mono text-gray-900">
                                          {variant.variantSku}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                          {Object.entries(variant.variantAttributes || {}).map(
                                            ([key, value]) => (
                                              <span
                                                key={key}
                                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                              >
                                                {key}: {value}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-sm">
                                          <div className="font-semibold text-gray-900">
                                            ₹{variant.finalPrice?.toLocaleString()}
                                          </div>
                                          {(variant.discountPercent ?? 0) > 0 && (
                                            <div className="text-xs text-gray-500 line-through">
                                              ₹{variant.actualPrice?.toLocaleString()}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="text-lg font-bold text-gray-900">
                                          {variant.stockQuantity}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          {variant.isActive ? (
                                            <>
                                              <CheckCircle className="w-4 h-4 text-green-600" />
                                              <span className="text-sm text-green-600">Active</span>
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-4 h-4 text-gray-400" />
                                              <span className="text-sm text-gray-400">Inactive</span>
                                            </>
                                          )}
                                        </div>
                                        <div className={`text-xs mt-1 ${variantStock.color}`}>
                                          {variantStock.label}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;