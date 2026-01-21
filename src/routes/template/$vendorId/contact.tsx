import { createFileRoute } from '@tanstack/react-router'
import { PreviewChrome } from '@/features/template-preview/components/PreviewChrome'
import { ContactPreview } from '@/features/template-preview/components/ContactPreview'
import { useTemplatePreviewData } from '@/features/template-preview/hooks/useTemplatePreviewData'
import { useLiveTemplatePreview } from '@/features/template-preview/hooks/useLiveTemplatePreview'

export const Route = createFileRoute('/template/$vendorId/contact')({
  component: TemplateContactPreviewRoute,
})

function TemplateContactPreviewRoute() {
  const { vendorId } = Route.useParams()
  const {
    template,
    sectionOrder,
    loading,
    error,
    products,
    categoryMap,
    subcategories,
  } = useTemplatePreviewData(vendorId, 'contact')
  const live = useLiveTemplatePreview(
    vendorId,
    'contact',
    template,
    sectionOrder
  )

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
      buttonLabel={template.components.home_page.button_header}
      theme={live.template.components.theme}
      categories={Object.entries(categoryMap).map(([id, name]) => ({
        _id: id,
        name,
      }))}
      subcategories={subcategories}
      active='contact'
    >
      <ContactPreview
        template={live.template}
        sectionOrder={live.sectionOrder}
        vendorId={vendorId}
        products={products}
        categoryMap={categoryMap}
      />
    </PreviewChrome>
  )
}
