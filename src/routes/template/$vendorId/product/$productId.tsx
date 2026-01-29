import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { createFileRoute } from '@tanstack/react-router'
import { BadgeCheck, ChevronLeft, Package, Tag } from 'lucide-react'
import { PreviewChrome } from '@/features/template-preview/components/PreviewChrome'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { useSelector } from 'react-redux'
import {
  getTemplateAuth,
  templateApiFetch,
} from '@/features/template-preview/utils/templateAuth'
import { toast } from 'sonner'
import { TemplatePageSkeleton } from '@/features/template-preview/components/TemplatePageSkeleton'

type CategoryMap = Record<string, string>

interface ProductDetail {
  _id?: string
  productName?: string
  brand?: string
  shortDescription?: string
  description?: string
  productCategory?: string
  defaultImages?: Array<{ url: string }>
  variants?: Array<{
    _id?: string
    variantSku?: string
    actualPrice?: number
    finalPrice?: number
    discountPercent?: number
    stockQuantity?: number
    variantsImageUrls?: Array<{ url: string }>
    variantAttributes?: Record<string, string>
  }>
  faqs?: Array<{ question?: string; answer?: string }>
}

interface TemplateMeta {
  logo?: string
  buttonLabel?: string
  theme?: {
    templateColor?: string
    fontScale?: number
  }
  customPages?: Array<{
    id?: string
    title?: string
    slug?: string
    isPublished?: boolean
  }>
  heroStyle?: {
    primaryButtonColor?: string
  }
}

export const Route = createFileRoute('/template/$vendorId/product/$productId')({
  component: TemplateProductDetail,
})

function TemplateProductDetail() {
  const { vendorId, productId } = Route.useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [templateMeta, setTemplateMeta] = useState<TemplateMeta | null>(null)
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({})
  const [vendorName, setVendorName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const token = useSelector((state: { auth?: { token?: string } }) => state?.auth?.token)

  const headers = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : undefined
  }, [token])

  const productCategory = useMemo(() => {
    if (!product?.productCategory) return 'Uncategorized'
    const mapped = categoryMap[product.productCategory]
    if (mapped) return mapped
    if (/^[a-f\d]{24}$/i.test(product.productCategory)) {
      return 'Uncategorized'
    }
    return product.productCategory
  }, [product?.productCategory, categoryMap])

  useEffect(() => {
    let mounted = true

    const loadProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v1/products/${productId}`)
        const payload = res.data?.product || res.data?.data || res.data
        return payload as ProductDetail
      } catch {
        return null
      }
    }

    const loadTemplate = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v1/templates/${vendorId}`, {
          headers,
        })
        const payload = res.data?.data || res.data?.template || res.data
        return payload as any
      } catch {
        return null
      }
    }

    const loadCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/v1/categories/getall`, {
          headers,
        })
        const list = res.data?.data || []
        if (!Array.isArray(list)) return {}
        return list.reduce<CategoryMap>((acc, item) => {
          const key = item?._id || item?.id
          const value =
            item?.name || item?.title || item?.categoryName || item?.label
          if (key && value) acc[key] = value
          return acc
        }, {})
      } catch {
        return {}
      }
    }

    const loadVendorProfile = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/v1/vendors/vendorprofile?id=${vendorId}`
        )
        const vendor = res.data?.vendor
        return (
          vendor?.name ||
          vendor?.businessName ||
          vendor?.storeName ||
          null
        )
      } catch {
        return null
      }
    }

    setLoading(true)
    setError(null)

    Promise.all([loadProduct(), loadCategories(), loadTemplate(), loadVendorProfile()])
      .then(([productResult, categoryResult, templateResult, vendorNameResult]) => {
        if (!mounted) return
        if (!productResult) {
          setError('Product not found.')
          return
        }
        setProduct(productResult)
        setCategoryMap(categoryResult || {})
        setVendorName(vendorNameResult || null)
        if (templateResult?.components) {
          setTemplateMeta({
            logo: templateResult.components.logo,
            buttonLabel: templateResult.components.home_page?.button_header,
            theme: templateResult.components.theme,
            customPages: templateResult.components.custom_pages || [],
            heroStyle: templateResult.components.home_page?.hero_style || {},
          })
        }
      })
      .catch(() => {
        if (!mounted) return
        setError('Failed to load product details.')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [productId, headers, vendorId])

  if (loading) {
    return <TemplatePageSkeleton />
  }

  if (error || !product) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        <div className='rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm text-white/80'>
          {error || 'Unable to load product.'}
        </div>
      </div>
    )
  }

  return (
    <PreviewChrome
      vendorId={vendorId}
      logoUrl={templateMeta?.logo}
      vendorName={vendorName || undefined}
      buttonLabel={templateMeta?.buttonLabel}
      buttonColor={templateMeta?.heroStyle?.primaryButtonColor}
      theme={templateMeta?.theme}
      customPages={templateMeta?.customPages || []}
      active='home'
    >
      <div className='flex items-center gap-3 text-sm text-slate-500'>
        <a
          href={`/template/${vendorId}`}
          className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to catalog
        </a>
      </div>

      <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='space-y-4'>
          <div className='overflow-hidden rounded-3xl border border-slate-200 bg-slate-100'>
            {product.defaultImages?.[0]?.url ? (
              <img
                src={product.defaultImages[0].url}
                alt={product.productName || 'Product'}
                className='h-[420px] w-full object-cover'
              />
            ) : (
              <div className='flex h-[420px] items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
                No Image
              </div>
            )}
          </div>
          <div className='grid gap-4 sm:grid-cols-3'>
            {(product.defaultImages || [])
              .slice(0, 3)
              .map((img, index) => (
                <div
                  key={`${img.url}-${index}`}
                  className='overflow-hidden rounded-2xl border border-slate-200 bg-slate-100'
                >
                  <img
                    src={img.url}
                    alt='Product'
                    className='h-28 w-full object-cover'
                  />
                </div>
              ))}
          </div>
        </div>

        <div className='space-y-6'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
              {productCategory}
            </p>
            <h1
              className='mt-2 text-3xl font-semibold text-slate-900'
              style={{ color: 'var(--template-accent)' }}
            >
              {product.productName}
            </h1>
            <p className='mt-2 text-sm text-slate-600'>
              {product.shortDescription || product.description}
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-3'>
              <span className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600'>
                <Tag className='h-4 w-4 text-slate-500' />
                {product.brand || 'Brand'}
              </span>
              <span className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700'>
                <BadgeCheck className='h-4 w-4' />
                Verified Listing
              </span>
            </div>
            <div className='mt-5 flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={async () => {
                  setMessage(null)
                  const auth = getTemplateAuth(String(vendorId))
                  if (!auth) {
                    toast.error('Please login to add items to cart.')
                    window.location.href = `/template/${vendorId}/login?next=/template/${vendorId}/product/${productId}`
                    return
                  }
                  const variantId = product?.variants?.[0]?._id
                  if (!variantId) {
                    toast.error('No variant available for this product.')
                    setMessage('No variant available.')
                    return
                  }
                  setAdding(true)
                  try {
                    await templateApiFetch(String(vendorId), '/cart', {
                      method: 'POST',
                      body: JSON.stringify({
                        product_id: productId,
                        variant_id: variantId,
                        quantity: 1,
                      }),
                    })
                    toast.success('Added to cart.')
                    setMessage('Added to cart.')
                  } catch (err: any) {
                    toast.error(err?.message || 'Unable to add to cart.')
                    setMessage(err?.message || 'Unable to add to cart.')
                  } finally {
                    setAdding(false)
                  }
                }}
                className='rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60'
                style={{
                  backgroundColor:
                    templateMeta?.heroStyle?.primaryButtonColor ||
                    'var(--template-accent)',
                }}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add to cart'}
              </button>
              {message && (
                <span className='text-xs font-semibold text-slate-500'>
                  {message}
                </span>
              )}
            </div>
          </div>

          <div className='rounded-3xl border border-slate-200 bg-white p-5'>
            <div className='flex items-center gap-2 text-sm font-semibold text-slate-700'>
              <Package className='h-4 w-4' />
              Variants
            </div>
            <div className='mt-4 space-y-3'>
              {(product.variants || []).map((variant, index) => (
                <div
                  key={variant.variantSku || index}
                  className='rounded-2xl border border-slate-200 bg-slate-50 p-4'
                >
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex flex-wrap gap-2'>
                      {Object.entries(variant.variantAttributes || {}).map(
                        ([key, value]) => (
                          <span
                            key={`${key}-${value}`}
                            className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600'
                          >
                            {key}: {value}
                          </span>
                        )
                      )}
                    </div>
                    <div
                      className='text-sm font-semibold text-slate-900'
                      style={{ color: 'var(--template-accent)' }}
                    >
                      Rs. {(variant.finalPrice || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500'>
                    <span>Stock: {variant.stockQuantity || 0}</span>
                    <span>Discount: {variant.discountPercent || 0}%</span>
                    <span className='text-slate-400'>
                      {variant.variantSku}
                    </span>
                  </div>
                </div>
              ))}
              {(product.variants || []).length === 0 && (
                <div className='rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500'>
                  No variants configured yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='rounded-3xl border border-slate-200 bg-white p-6'>
          <h2 className='text-lg font-semibold text-slate-900'>Description</h2>
          <p className='mt-3 text-sm text-slate-600'>
            {product.description || 'No description provided.'}
          </p>
        </div>
        <div className='rounded-3xl border border-slate-200 bg-white p-6'>
          <h2 className='text-lg font-semibold text-slate-900'>FAQs</h2>
          <div className='mt-4 space-y-3 text-sm text-slate-600'>
            {(product.faqs || []).map((faq, index) => (
              <div
                key={`${faq.question}-${index}`}
                className='rounded-2xl border border-slate-200 bg-slate-50 p-4'
              >
                <p className='font-semibold text-slate-900'>
                  {faq.question || 'Question'}
                </p>
                <p className='mt-2'>{faq.answer || 'Answer'}</p>
              </div>
            ))}
            {(product.faqs || []).length === 0 && (
              <p className='text-slate-500'>No FAQs available yet.</p>
            )}
          </div>
        </div>
      </div>
    </PreviewChrome>
  )
}
