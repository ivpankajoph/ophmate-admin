import { createFileRoute } from '@tanstack/react-router'
import { PreviewChrome } from '@/features/template-preview/components/PreviewChrome'
import { useTemplatePreviewData } from '@/features/template-preview/hooks/useTemplatePreviewData'
import { useLiveTemplatePreview } from '@/features/template-preview/hooks/useLiveTemplatePreview'

type Section = {
  id?: string
  type?: string
  data?: Record<string, unknown>
}

export const Route = createFileRoute('/template/$vendorId/page/$pageSlug')({
  component: TemplateCustomPageRoute,
})

function TemplateCustomPageRoute() {
  const { vendorId, pageSlug } = Route.useParams()
  const {
    template,
    sectionOrder,
    categoryMap,
    subcategories,
    vendorName,
    loading,
    error,
  } = useTemplatePreviewData(vendorId, 'home')
  const live = useLiveTemplatePreview(
    vendorId,
    'home',
    template,
    sectionOrder
  )

  const pages = live.template.components.custom_pages || []
  const page =
    pages.find((item) => item.slug === pageSlug) ||
    pages.find((item) => item.id === pageSlug)

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        <div className='text-center'>
          <div className='mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white'></div>
          <p className='mt-4 text-sm text-white/70'>Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-950 text-white'>
        <div className='rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm text-white/80'>
          {error}
        </div>
      </div>
    )
  }

  return (
    <PreviewChrome
      vendorId={vendorId}
      logoUrl={template.components.logo}
      vendorName={vendorName || undefined}
      buttonLabel={template.components.home_page.button_header}
      theme={live.template.components.theme}
      customPages={template.components.custom_pages || []}
      categories={Object.entries(categoryMap).map(([id, name]) => ({
        _id: id,
        name,
      }))}
      subcategories={subcategories}
      active='home'
    >
      <div className='space-y-8'>
        <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Custom Page
          </p>
          <h1
            className='mt-3 text-3xl font-semibold text-slate-900'
            style={{ color: 'var(--template-accent)' }}
          >
            {page?.title || 'Untitled Page'}
          </h1>
          <p className='mt-2 text-sm text-slate-600'>
            Customize sections from the Template Pages editor.
          </p>
        </section>

        <div className='space-y-6'>
          {(page?.sections || []).map((section: Section, index: number) => (
            <CustomSectionRenderer
              key={section.id || `${section.type}-${index}`}
              section={section}
            />
          ))}
          {(page?.sections || []).length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500'>
              Add sections to this page from the Template Pages builder.
            </div>
          )}
        </div>
      </div>
    </PreviewChrome>
  )
}

function CustomSectionRenderer({ section }: { section: Section }) {
  const type = section.type || 'text'
  const data = section.data || {}
  const style = (data as { style?: Record<string, unknown> }).style || {}
  const textColor = style.textColor as string | undefined
  const backgroundColor = style.backgroundColor as string | undefined
  const fontSize = Number(style.fontSize || 0) || undefined
  const buttonColor = style.buttonColor as string | undefined

  if (type === 'hero') {
    return (
      <section
        className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div
          className='px-6 py-12 text-center'
          style={textColor ? { color: textColor } : undefined}
        >
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            {String(data.kicker || 'Highlight')}
          </p>
          <h2
            className='mt-3 text-3xl font-semibold text-slate-900'
            style={{
              color: textColor || 'var(--template-accent)',
              fontSize: fontSize ? `${fontSize}px` : undefined,
            }}
          >
            {String(data.title || 'Hero headline')}
          </h2>
          <p className='mt-3 text-sm text-slate-600'>
            {String(data.subtitle || 'Describe the purpose of this page.')}
          </p>
          {(Array.isArray(data.buttons) && data.buttons.length) || data.buttonLabel ? (
            <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
              {(Array.isArray(data.buttons) && data.buttons.length
                ? data.buttons
                : [{ label: data.buttonLabel, href: data.buttonHref }]).map(
                (button: any, index: number) => (
                  <a
                    key={`${button.label}-${index}`}
                    href={String(button.href || '#')}
                    className='rounded-full px-5 py-2 text-sm font-semibold text-white'
                    style={{
                      backgroundColor: buttonColor || 'var(--template-accent)',
                    }}
                  >
                    {String(button.label || 'Button')}
                  </a>
                )
              )}
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  if (type === 'image') {
    return (
      <section
        className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <div className='aspect-[16/9] w-full bg-slate-100'>
          {data.imageUrl ? (
            <img
              src={String(data.imageUrl)}
              alt={String(data.caption || 'Section image')}
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
              Add Image
            </div>
          )}
        </div>
        {data.caption ? (
          <div
            className='px-6 py-4 text-sm text-slate-600'
            style={{
              color: textColor,
              fontSize: fontSize ? `${fontSize}px` : undefined,
            }}
          >
            {String(data.caption)}
          </div>
        ) : null}
      </section>
    )
  }

  if (type === 'features') {
    const items = Array.isArray(data.items) ? data.items : []
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3
          className='text-lg font-semibold text-slate-900'
          style={{
            color: textColor,
            fontSize: fontSize ? `${fontSize}px` : undefined,
          }}
        >
          {String(data.title || 'Key highlights')}
        </h3>
        <div className='mt-4 grid gap-4 md:grid-cols-3'>
          {items.map((item: any, index: number) => (
            <div
              key={`${item?.title}-${index}`}
              className='rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm'
            >
              <p className='font-semibold text-slate-900' style={{ color: textColor }}>
                {String(item?.title || 'Feature')}
              </p>
              <p className='mt-2 text-slate-600'>
                {String(item?.description || 'Describe the benefit.')}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400'>
              Add feature items
            </div>
          )}
        </div>
      </section>
    )
  }

  if (type === 'cta') {
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3
          className='text-2xl font-semibold'
          style={{
            color: textColor || undefined,
            fontSize: fontSize ? `${fontSize}px` : undefined,
          }}
        >
          {String(data.title || 'Call to action')}
        </h3>
        <p
          className='mt-3 text-sm text-white/80'
          style={{ color: textColor }}
        >
          {String(data.subtitle || 'Encourage visitors to take an action.')}
        </p>
        {(Array.isArray(data.buttons) && data.buttons.length) || data.buttonLabel ? (
          <div className='mt-6 flex flex-wrap gap-3'>
            {(Array.isArray(data.buttons) && data.buttons.length
              ? data.buttons
              : [{ label: data.buttonLabel, href: data.buttonHref }]).map(
              (button: any, index: number) => (
                <a
                  key={`${button.label}-${index}`}
                  href={String(button.href || '#')}
                  className='inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900'
                  style={{
                    backgroundColor: buttonColor || undefined,
                    color: buttonColor ? '#fff' : undefined,
                  }}
                >
                  {String(button.label || 'Button')}
                </a>
              )
            )}
          </div>
        ) : null}
      </section>
    )
  }

  if (type === 'gallery') {
    const images = Array.isArray(data.images) ? data.images : []
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3
          className='text-lg font-semibold text-slate-900'
          style={{ color: textColor }}
        >
          {String(data.title || 'Gallery')}
        </h3>
        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {images.map((image: string, index: number) => (
            <div
              key={`${image}-${index}`}
              className='aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100'
            >
              {image ? (
                <img
                  src={image}
                  alt='Gallery'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
                  Add Image
                </div>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400'>
              Add gallery images
            </div>
          )}
        </div>
      </section>
    )
  }

  if (type === 'pricing') {
    const plans = Array.isArray(data.plans) ? data.plans : []
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3
          className='text-lg font-semibold text-slate-900'
          style={{ color: textColor }}
        >
          {String(data.title || 'Pricing Plans')}
        </h3>
        <p className='mt-2 text-sm text-slate-600'>
          {String(data.subtitle || 'Choose the plan that fits your goals.')}
        </p>
        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          {plans.map((plan: any, index: number) => (
            <div
              key={`${plan.name}-${index}`}
              className='rounded-2xl border border-slate-200 bg-slate-50 p-5'
            >
              <h4 className='text-lg font-semibold text-slate-900'>
                {String(plan.name || 'Plan')}
              </h4>
              <p className='mt-2 text-2xl font-semibold text-slate-900'>
                Rs. {String(plan.price || '0')}
              </p>
              <p className='mt-2 text-sm text-slate-600'>
                {String(plan.description || '')}
              </p>
              <ul className='mt-4 space-y-2 text-sm text-slate-600'>
                {(plan.features || []).map((feature: string, idx: number) => (
                  <li key={`${feature}-${idx}`}>• {feature}</li>
                ))}
              </ul>
              {plan.ctaLabel ? (
                <button
                  type='button'
                  className='mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white'
                  style={{
                    backgroundColor: buttonColor || 'var(--template-accent)',
                  }}
                >
                  {String(plan.ctaLabel)}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (type === 'faq') {
    const items = Array.isArray(data.items) ? data.items : []
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3 className='text-lg font-semibold text-slate-900'>
          {String(data.title || 'FAQs')}
        </h3>
        <p className='mt-2 text-sm text-slate-600'>
          {String(data.subtitle || '')}
        </p>
        <div className='mt-4 space-y-3'>
          {items.map((item: any, index: number) => (
            <div
              key={`${item.question}-${index}`}
              className='rounded-2xl border border-slate-100 bg-slate-50 p-4'
            >
              <p className='font-semibold text-slate-900'>
                {String(item.question || 'Question')}
              </p>
              <p className='mt-2 text-sm text-slate-600'>
                {String(item.answer || 'Answer')}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400'>
              Add FAQs
            </div>
          )}
        </div>
      </section>
    )
  }

  if (type === 'testimonials') {
    const items = Array.isArray(data.items) ? data.items : []
    return (
      <section
        className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <h3 className='text-lg font-semibold text-slate-900'>
          {String(data.title || 'Testimonials')}
        </h3>
        <p className='mt-2 text-sm text-slate-600'>
          {String(data.subtitle || '')}
        </p>
        <div className='mt-4 grid gap-4 md:grid-cols-2'>
          {items.map((item: any, index: number) => (
            <div
              key={`${item.name}-${index}`}
              className='rounded-2xl border border-slate-100 bg-slate-50 p-4'
            >
              <p className='text-sm text-slate-600'>
                "{String(item.quote || 'Great experience!')}"
              </p>
              <p className='mt-3 text-sm font-semibold text-slate-900'>
                {String(item.name || 'Customer')}
              </p>
              <p className='text-xs text-slate-500'>
                {String(item.role || '')}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-400'>
              Add testimonials
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <h3
        className='text-lg font-semibold text-slate-900'
        style={{ color: textColor, fontSize: fontSize ? `${fontSize}px` : undefined }}
      >
        {String(data.title || 'Text block')}
      </h3>
      <p className='mt-2 text-sm text-slate-600' style={{ color: textColor }}>
        {String(data.body || 'Add descriptive text for this section.')}
      </p>
    </section>
  )
}
