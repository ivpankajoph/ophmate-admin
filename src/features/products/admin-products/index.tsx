import { useState, useEffect } from 'react'
import { Eye, Package, X, Box, Tag, TrendingUp } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Pagination } from '@/components/pagination'

interface Product {
  _id: string
  productName: string
  brand: string
  shortDescription: string
  description: string
  defaultImages: Array<{ url: string }>
  variants: Array<{
    variantSku: string
    variantAttributes: Record<string, any>
    actualPrice: number
    discountPercent: number
    finalPrice: number
    stockQuantity: number
    variantsImageUrls: Array<{ url: string }>
  }>
  status: string
  createdAt: string
  specifications: Array<Record<string, any>>
  faqs: Array<{ question: string; answer: string }>
}

const AdminProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page])

  const token = useSelector((state: any) => state.auth.token)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/v1/products/all?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      setProducts(data?.products || [])
      setTotalPages(data?.pagination?.totalPages || 1)
      setTotalProducts(data?.pagination?.total || 0)
      setLoading(false)
      
    } catch (err) {
      setError('Failed to fetch products')
      setLoading(false)
    }
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getTotalStock = (variants: any[] = []) => {
    if (!Array.isArray(variants)) return 0
    return variants.reduce((sum, v) => sum + (v?.stockQuantity || 0), 0)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent'></div>
          <p className='text-gray-600'>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center text-red-600'>{error}</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Product Inventory
          </h1>
          <p className='text-gray-600'>Manage and monitor your product catalog</p>
        </div>

        {/* Stats Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-gray-100 p-3'>
                <Package className='h-6 w-6 text-gray-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Products</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {totalProducts || products?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-gray-100 p-3'>
                <Box className='h-6 w-6 text-gray-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Variants</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {products?.reduce((sum, p) => sum + (p?.variants?.length || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-green-100 p-3'>
                <TrendingUp className='h-6 w-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Stock</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {products?.reduce(
                    (sum, p) => sum + getTotalStock(p?.variants),
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg bg-white shadow'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Product
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Brand
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Variants
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Stock
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Price Range
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {products?.map((product)=> {
                const variants = product?.variants || []
                const defaultImage = product?.defaultImages?.[0]?.url
                const minPrice = variants.length > 0 
                  ? Math.min(...variants.map((v) => v?.finalPrice || 0))
                  : 0
                const maxPrice = variants.length > 0
                  ? Math.max(...variants.map((v) => v?.finalPrice || 0))
                  : 0
                
                return (
                  <tr key={product?._id || Math.random()} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={defaultImage || '/placeholder-image.jpg'}
                          alt={product?.productName || 'Product'}
                          className='h-16 w-16 rounded-lg object-cover'
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg'
                          }}
                        />
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            {product?.productName || 'Unnamed Product'}
                          </h3>
                         
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Tag className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-900'>{product?.brand || 'N/A'}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className='font-medium text-gray-900'>
                        {variants.length} variant{variants.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      <span className='font-medium text-gray-900'>
                        {getTotalStock(variants)} units
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm'>
                        <div className='font-semibold text-gray-900'>
                          ₹{minPrice.toLocaleString()} {minPrice !== maxPrice && `to ₹${maxPrice.toLocaleString()}`}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                          product?.status || 'pending'
                        )}`}
                      >
                        {(product?.status || 'pending').charAt(0).toUpperCase() + 
                         (product?.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className='inline-flex transform items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg'
                      >
                        <Eye className='h-4 w-4' />
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={loading}
        />
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl'>
            {/* Modal Header */}
            <div className='sticky top-0 z-10 flex items-center justify-between border-b bg-gradient-to-r from-indigo-600 to-gray-600 px-6 py-4'>
              <h2 className='text-2xl font-bold text-white'>Product Details</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className='rounded-lg p-2 transition-colors hover:bg-white/20'
              >
                <X className='h-6 w-6 text-white' />
              </button>
            </div>

            <div className='space-y-6 p-6'>
              {/* Product Images */}
              <div className='grid grid-cols-4 gap-4'>
                {selectedProduct?.defaultImages?.length > 0 ? (
                  selectedProduct.defaultImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img?.url || '/placeholder-image.jpg'}
                      alt={`Product ${idx + 1}`}
                      className='aspect-square rounded-lg object-cover'
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg'
                      }}
                    />
                  ))
                ) : (
                  <div className='aspect-square rounded-lg bg-gray-200 flex items-center justify-center'>
                    <Package className='h-12 w-12 text-gray-400' />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div>
                <h3 className='mb-2 text-2xl font-bold text-gray-900'>
                  {selectedProduct?.productName || 'Unnamed Product'}
                </h3>
                <p className='text-gray-600'>
                  {selectedProduct?.description || selectedProduct?.shortDescription || 'No description available'}
                </p>
                <div className='mt-4 flex items-center gap-4'>
                  <span className='flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1'>
                    <Tag className='h-4 w-4 text-gray-600' />
                    <span className='font-medium'>{selectedProduct?.brand || 'N/A'}</span>
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                      selectedProduct?.status || 'pending'
                    )}`}
                  >
                    {(selectedProduct?.status || 'pending').charAt(0).toUpperCase() +
                      (selectedProduct?.status || 'pending').slice(1)}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              {selectedProduct?.specifications?.length > 0 && 
               selectedProduct.specifications[0] && 
               Object.keys(selectedProduct.specifications[0]).length > 0 && (
                <div>
                  <h4 className='mb-3 text-lg font-semibold text-gray-900'>
                    Specifications
                  </h4>
                  <div className='grid grid-cols-2 gap-3'>
                    {Object.entries(selectedProduct.specifications[0]).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className='rounded-lg border border-gray-200 bg-gray-50 p-3'
                        >
                          <p className='text-xs font-medium uppercase text-gray-600'>
                            {key}
                          </p>
                          <p className='mt-1 font-semibold text-gray-900'>
                            {typeof value === 'boolean'
                              ? value
                                ? 'Yes'
                                : 'No'
                              : value != null ? String(value) : 'N/A'}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Variants */}
              <div>
                <h4 className='mb-3 text-lg font-semibold text-gray-900'>
                  Available Variants ({selectedProduct?.variants?.length || 0})
                </h4>
                <div className='space-y-4'>
                  {selectedProduct?.variants?.map((variant, idx) => (
                    <div
                      key={variant?.variantSku || idx}
                      className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'
                    >
                      <div className='flex gap-4'>
                        {variant?.variantsImageUrls?.[0]?.url && (
                          <img
                            src={variant.variantsImageUrls[0].url}
                            alt='Variant'
                            className='h-24 w-24 rounded-lg object-cover'
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg'
                            }}
                          />
                        )}
                        <div className='flex-1'>
                          <div className='mb-2 flex flex-wrap gap-2'>
                            {variant?.variantAttributes && 
                             Object.entries(variant.variantAttributes).map(
                              ([key, value]) => (
                                <span
                                  key={key}
                                  className='rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700'
                                >
                                  {value || 'N/A'}
                                </span>
                              )
                            )}
                          </div>
                          <div className='grid grid-cols-4 gap-3'>
                            <div>
                              <p className='text-xs text-gray-600'>
                                Original Price
                              </p>
                              <p className='font-semibold text-gray-900'>
                                ₹{(variant?.actualPrice || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-600'>
                                Final Price
                              </p>
                              <p className='font-semibold text-green-600'>
                                ₹{(variant?.finalPrice || 0).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-600'>Discount</p>
                              <p className='font-semibold text-red-600'>
                                {variant?.discountPercent || 0}% OFF
                              </p>
                            </div>
                            <div>
                              <p className='text-xs text-gray-600'>Stock</p>
                              <p className='font-semibold text-gray-900'>
                                {variant?.stockQuantity || 0} units
                              </p>
                            </div>
                          </div>
                          <p className='mt-2 text-xs text-gray-500'>
                            SKU: {variant?.variantSku || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {selectedProduct?.faqs?.length > 0 && (
                <div>
                  <h4 className='mb-3 text-lg font-semibold text-gray-900'>
                    Frequently Asked Questions
                  </h4>
                  <div className='space-y-3'>
                    {selectedProduct.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className='rounded-lg border border-gray-200 bg-gray-50 p-4'
                      >
                        <p className='font-semibold text-gray-900'>
                          Q: {faq?.question || 'No question'}
                        </p>
                        <p className='mt-2 text-gray-600'>
                          A: {faq?.answer || 'No answer'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProductsTable
