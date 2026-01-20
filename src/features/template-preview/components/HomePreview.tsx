import { ArrowUpRight } from 'lucide-react'
import { type TemplateData } from '@/features/vendor-template/data'
import { JSX } from 'react'

interface Product {
  _id?: string
  productName?: string
  shortDescription?: string
  productCategory?: {
    _id?: string
    name?: string
    title?: string
    categoryName?: string
  } | string
  productCategoryName?: string
  defaultImages?: Array<{ url: string }>
  variants?: Array<{ finalPrice?: number }>
}

interface HomePreviewProps {
  template: TemplateData
  products: Product[]
  sectionOrder: string[]
  categoryMap?: Record<string, string>
  vendorId: string
}

const getMinPrice = (variants: Array<{ finalPrice?: number }> = []) => {
  const values = variants
    .map((variant) => variant.finalPrice)
    .filter((value): value is number => typeof value === 'number')
  return values.length ? Math.min(...values) : 0
}

const getCategoryLabel = (
  product: Product,
  categoryMap: Record<string, string>
) => {
  if (product.productCategoryName) return product.productCategoryName
  if (typeof product.productCategory === 'string') {
    const fallback = categoryMap[product.productCategory]
    if (fallback) return fallback
    if (/^[a-f\d]{24}$/i.test(product.productCategory)) {
      return 'Uncategorized'
    }
    return product.productCategory
  }
  return (
    categoryMap[product.productCategory as string] ||
    product.productCategory?.name ||
    product.productCategory?.title ||
    product.productCategory?.categoryName ||
    'Uncategorized'
  )
}

export function HomePreview({
  template,
  products,
  sectionOrder,
  categoryMap = {},
  vendorId,
}: HomePreviewProps) {
  const hero = template.components.home_page
  const desc = template.components.home_page.description

  const sections: Record<string, JSX.Element> = {
    hero: (
      <section className='relative overflow-hidden rounded-3xl border border-white/70 bg-slate-900 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)]'>
        <div className='absolute inset-0 opacity-40'>
          {hero.backgroundImage ? (
            <img
              src={hero.backgroundImage}
              alt='Hero background'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black' />
          )}
        </div>
        <div className='relative z-10 grid gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='space-y-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.34em] text-white/70'>
              Featured Collection
            </p>
            <h1 className='text-3xl font-semibold leading-tight sm:text-5xl'>
              {hero.header_text || 'Build a storefront that feels alive.'}
            </h1>
            <p className='max-w-xl text-base text-white/80'>
              {hero.header_text_small ||
                'Showcase your products with cinematic layouts and a story-first approach.'}
            </p>
            <div className='flex flex-wrap gap-3'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900'>
                {hero.button_header || 'Explore Products'}
                <ArrowUpRight className='h-4 w-4' />
              </div>
              <div className='inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white/80'>
                New arrivals weekly
              </div>
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/60'>
                Rating
              </p>
              <p className='mt-2 text-3xl font-semibold'>4.9</p>
              <p className='text-sm text-white/70'>from 2,300+ customers</p>
            </div>
            <div className='rounded-2xl border border-white/20 bg-white/10 p-4'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/60'>
                Fulfillment
              </p>
              <p className='mt-2 text-3xl font-semibold'>48h</p>
              <p className='text-sm text-white/70'>average delivery time</p>
            </div>
          </div>
        </div>
      </section>
    ),
    description: (
      <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.32em] text-slate-400'>
            Brand Story
          </p>
          <h2 className='text-2xl font-semibold text-slate-900 sm:text-3xl'>
            {desc.large_text || 'A storefront built for modern shoppers.'}
          </h2>
          <p className='text-sm text-slate-600 sm:text-base'>
            {desc.summary ||
              'Curate hero products, share your story, and inspire visitors to explore your catalog.'}
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
              Success
            </p>
            <p className='mt-2 text-3xl font-semibold text-slate-900'>
              {desc.percent.percent_in_number || '92'}
              <span className='text-lg text-slate-500'>%</span>
            </p>
            <p className='text-sm text-slate-500'>
              {desc.percent.percent_text || 'Satisfied buyers'}
            </p>
          </div>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
              Sold
            </p>
            <p className='mt-2 text-3xl font-semibold text-slate-900'>
              {desc.sold.sold_number || '12k'}
            </p>
            <p className='text-sm text-slate-500'>
              {desc.sold.sold_text || 'Products shipped'}
            </p>
          </div>
        </div>
      </section>
    ),
    products: (
      <section className='space-y-4'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.32em] text-slate-400'>
              Catalog
            </p>
            <h3 className='text-2xl font-semibold text-slate-900'>
              Products in this template
            </h3>
          </div>
          <p className='text-sm text-slate-500'>
            {products.length} products available
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          {Array.from(new Set(products.map((product) => getCategoryLabel(product, categoryMap))))
            .filter((label) => label && label !== 'Uncategorized')
            .map((label) => (
              <span
                key={label}
                className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600'
              >
                {label}
              </span>
            ))}
          {products.length === 0 && (
            <span className='rounded-full border border-dashed border-slate-300 bg-white px-3 py-1 text-xs text-slate-400'>
              No categories yet
            </span>
          )}
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {products.slice(0, 6).map((product, index) => (
            <a
              key={product._id || `${product.productName}-${index}`}
              href={
                product._id
                  ? `/template/${vendorId}/product/${product._id}`
                  : '#'
              }
              className='group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
            >
              <div className='aspect-[4/3] overflow-hidden bg-slate-100'>
                {product.defaultImages?.[0]?.url ? (
                  <img
                    src={product.defaultImages[0].url}
                    alt={product.productName || 'Product'}
                    className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
                    No Image
                  </div>
                )}
              </div>
              <div className='space-y-2 p-4'>
                <span className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
                  {getCategoryLabel(product, categoryMap)}
                </span>
                <p className='text-sm font-semibold text-slate-900'>
                  {product.productName || 'Untitled Product'}
                </p>
                <p className='line-clamp-2 text-xs text-slate-500'>
                  {product.shortDescription || 'No description yet.'}
                </p>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-semibold text-slate-900'>
                    Rs. {getMinPrice(product.variants).toLocaleString()}
                  </span>
                  <span className='text-xs text-slate-400'>View</span>
                </div>
              </div>
            </a>
          ))}
          {products.length === 0 && (
            <div className='col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500'>
              Upload products from the dashboard to populate this section.
            </div>
          )}
        </div>
      </section>
    ),
  }

  const defaultOrder = ['hero', 'description', 'products']
  const order = sectionOrder.length ? sectionOrder : defaultOrder
  const normalizedOrder = order.includes('products')
    ? order
    : [...order, 'products']

  return (
    <div className='space-y-10'>
      {normalizedOrder.map((key) => (
        <div key={key}>{sections[key] || null}</div>
      ))}
    </div>
  )
}
