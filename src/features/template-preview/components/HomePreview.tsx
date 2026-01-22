import { ArrowUpRight } from 'lucide-react'
import { type TemplateData } from '@/features/vendor-template/data'
import { JSX, useMemo } from 'react'

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
      return ''
    }
    return product.productCategory
  }
  return (
    categoryMap[product.productCategory as string] ||
    product.productCategory?.name ||
    product.productCategory?.title ||
    product.productCategory?.categoryName ||
    ''
  )
}

const toCategorySlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const getCategoryId = (product: Product, categoryMap: Record<string, string>) => {
  if (typeof product.productCategory === 'string') {
    if (categoryMap[product.productCategory]) return product.productCategory
    if (/^[a-f\d]{24}$/i.test(product.productCategory)) {
      return product.productCategory
    }
    return undefined
  }
  const id = product.productCategory?._id
  return id || undefined
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
  const theme = template.components.theme
  const accent = theme?.templateColor || '#0f172a'
  const bannerColor = theme?.bannerColor || '#0f172a'
  const heroStyle = hero.hero_style || {}
  const productStyle = hero.products_style || {}

  const categoryEntries = useMemo(() => {
    const map = new Map<string, { label: string; id?: string }>()
    products.forEach((product) => {
      const label = getCategoryLabel(product, categoryMap)
      if (!label) return
      const id = getCategoryId(product, categoryMap)
      const key = id || label
      if (!map.has(key)) map.set(key, { label, id })
    })
    return Array.from(map.values())
  }, [products, categoryMap])

  const emitSelect = (sectionId: string, componentId?: string) => {
    if (typeof window === 'undefined') return
    window.parent?.postMessage(
      {
        type: 'template-editor-select',
        vendorId,
        page: 'home',
        sectionId,
        componentId,
      },
      window.location.origin
    )
  }

  const wrapSection = (sectionId: string, content: JSX.Element) => (
    <div
      className='group cursor-pointer rounded-3xl transition hover:ring-2 hover:ring-slate-900/15'
      onClickCapture={(event) => {
        if (
          sectionId === 'products' &&
          (event.target as HTMLElement | null)?.closest?.('a[href]')
        ) {
          return
        }
        event.preventDefault()
        event.stopPropagation()
        emitSelect(sectionId)
      }}
    >
      {content}
    </div>
  )

  const sections: Record<string, JSX.Element> = {
    hero: wrapSection(
      'hero',
      (
      <section
        className='relative overflow-hidden rounded-3xl border border-white/70 bg-slate-900 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)]'
        style={{ backgroundColor: bannerColor }}
      >
        <div className='absolute inset-0 opacity-40'>
          {hero.backgroundImage ? (
            <img
              src={hero.backgroundImage}
              alt='Hero background'
              className='h-full w-full object-cover'
            />
          ) : (
            <div
              className='h-full w-full'
              style={{ backgroundColor: bannerColor }}
            />
          )}
        </div>
        <div
          className='absolute inset-0 opacity-30'
          style={{ backgroundColor: bannerColor }}
        />
        <div className='relative z-10 grid gap-6 px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]'>
          <div className='space-y-4'>
            <p
              className='text-xs font-semibold uppercase tracking-[0.34em] text-white/70'
              onClickCapture={(event) => {
                event.preventDefault()
                event.stopPropagation()
                emitSelect('hero', 'hero.kicker')
              }}
              style={{
                color: heroStyle.badgeColor || undefined,
                fontSize: heroStyle.badgeSize
                  ? `${heroStyle.badgeSize}px`
                  : undefined,
              }}
            >
              {hero.hero_kicker || 'Featured Collection'}
            </p>
            <h1
              className='text-3xl font-semibold leading-tight sm:text-5xl'
              onClickCapture={(event) => {
                event.preventDefault()
                event.stopPropagation()
                emitSelect('hero', 'hero.title')
              }}
              style={{
                color: heroStyle.titleColor || undefined,
                fontSize: heroStyle.titleSize
                  ? `${heroStyle.titleSize}px`
                  : undefined,
              }}
            >
              {hero.header_text || 'Build a storefront that feels alive.'}
            </h1>
            <p
              className='max-w-xl text-base text-white/80'
              onClickCapture={(event) => {
                event.preventDefault()
                event.stopPropagation()
                emitSelect('hero', 'hero.subtitle')
              }}
              style={{
                color: heroStyle.subtitleColor || undefined,
                fontSize: heroStyle.subtitleSize
                  ? `${heroStyle.subtitleSize}px`
                  : undefined,
              }}
            >
              {hero.header_text_small ||
                'Showcase your products with cinematic layouts and a story-first approach.'}
            </p>
            <div className='flex flex-wrap gap-3'>
              <div
                className='inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white'
                onClickCapture={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  emitSelect('hero', 'hero.primaryButton')
                }}
                style={{
                  backgroundColor: heroStyle.primaryButtonColor || accent,
                }}
              >
                {hero.button_header || 'Explore Products'}
                <ArrowUpRight className='h-4 w-4' />
              </div>
              <div
                className='inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white/80'
                onClickCapture={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  emitSelect('hero', 'hero.secondaryButton')
                }}
                style={{
                  borderColor: heroStyle.secondaryButtonColor || undefined,
                  color: heroStyle.badgeColor || undefined,
                }}
              >
                {hero.button_secondary || hero.badge_text || 'New arrivals weekly'}
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
      )
    ),
    description: wrapSection(
      'description',
      (
      <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.32em] text-slate-400'>
            Brand Story
          </p>
          <h2
            className='text-2xl font-semibold text-slate-900 sm:text-3xl'
            style={{ color: 'var(--template-accent)' }}
          >
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
      )
    ),
    products: wrapSection(
      'products',
      (
      <section className='space-y-4'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
          <p
            className='text-xs font-semibold uppercase tracking-[0.32em] text-slate-400'
            onClickCapture={(event) => {
              event.preventDefault()
              event.stopPropagation()
              emitSelect('products', 'products.kicker')
            }}
            style={{
              color: productStyle.kickerColor || undefined,
              fontSize: productStyle.kickerSize
                ? `${productStyle.kickerSize}px`
                : undefined,
            }}
          >
              {hero.products_kicker || 'Catalog'}
            </p>
            <h3
              className='text-2xl font-semibold text-slate-900'
              onClickCapture={(event) => {
                event.preventDefault()
                event.stopPropagation()
                emitSelect('products', 'products.heading')
              }}
              style={{
                color: productStyle.titleColor || 'var(--template-accent)',
                fontSize: productStyle.titleSize
                  ? `${productStyle.titleSize}px`
                  : undefined,
              }}
            >
              {hero.products_heading || 'Products in this template'}
            </h3>
          </div>
          <p className='text-sm text-slate-500'>
            {hero.products_subtitle ||
              `${products.length} products available`}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <a
            href={`/template/${vendorId}`}
            className='rounded-full border bg-white px-3 py-1 text-xs font-semibold transition'
            style={{ borderColor: accent, color: accent }}
          >
            All
          </a>
          {categoryEntries.map((entry) => {
            const slug = entry.id ? entry.id : toCategorySlug(entry.label)
            return (
              <a
                key={`${entry.label}-${slug}`}
                href={`/template/${vendorId}/category/${slug}`}
                className='rounded-full border bg-white px-3 py-1 text-xs font-semibold transition'
                style={{ borderColor: accent, color: accent }}
              >
                {entry.label}
              </a>
            )
          })}
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
                {getCategoryLabel(product, categoryMap) ? (
                  <span className='text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'>
                    {getCategoryLabel(product, categoryMap)}
                  </span>
                ) : null}
                <p className='text-sm font-semibold text-slate-900'>
                  {product.productName || 'Untitled Product'}
                </p>
                <p className='line-clamp-2 text-xs text-slate-500'>
                  {product.shortDescription || 'No description yet.'}
                </p>
                <div className='flex items-center justify-between'>
                  <span
                    className='text-sm font-semibold text-slate-900'
                    style={{ color: 'var(--template-accent)' }}
                  >
                    Rs. {getMinPrice(product.variants).toLocaleString()}
                  </span>
                  <span
                    className='text-xs'
                    style={{ color: 'var(--template-accent)' }}
                  >
                    View
                  </span>
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
      )
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
