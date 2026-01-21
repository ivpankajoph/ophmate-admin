'use client'

import { JSX, useEffect, useMemo, useState } from 'react'
import { Link2, Rocket, Wand2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND } from '@/config'
import { DomainModal } from './components/DomainModel'
import { TemplatePageLayout } from './components/TemplatePageLayout'
import { TemplatePreviewPanel } from './components/TemplatePreviewPanel'
import { TemplateSectionOrder } from './components/TemplateSectionOrder'
import { BasicInfoSection } from './components/form/BasicInfoSection'
import { DeploymentModal } from './components/form/DeploymentModal'
import { DescriptionSection } from './components/form/DescriptionSection'
import { HeroSection } from './components/form/HeroSection'
import { SubmitSection } from './components/form/SubmitSection'
import { ThemeSettingsSection } from './components/form/ThemeSettingsSection'
import { useTemplateForm } from './components/hooks/useTemplateForm'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function TemplateForm() {
  const {
    data,
    updateField,
    handleImageChange,
    handleSubmit,
    vendor_id,
    uploadingPaths,
    submitStatus,
    isSubmitting,
    open,
    setOpen,
    handleDeploy,
    isDeploying,
    deployMessage,
    handleCancel,
    loadedSectionOrder,
  } = useTemplateForm()

  const [domainOpen, setDomainOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState([
    'branding',
    'hero',
    'description',
    'products',
  ])

  useEffect(() => {
    if (loadedSectionOrder.length) {
      setSectionOrder(loadedSectionOrder)
    }
  }, [loadedSectionOrder])

  useEffect(() => {
    if (!selectedSection) return
    const container = document.querySelector(
      '[data-editor-scroll-container="true"]'
    ) as HTMLElement | null
    const target = document.querySelector(
      `[data-editor-section="${selectedSection}"]`
    ) as HTMLElement | null
    if (container && target) {
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const top =
        targetRect.top - containerRect.top + container.scrollTop - 12
      container.scrollTo({ top, behavior: 'smooth' })
      return
    }
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedSection])

  const previewUrl = vendor_id ? `/template/${vendor_id}` : undefined
  const fullPreviewUrl = vendor_id
    ? `${VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND}/template/${vendor_id}`
    : undefined

  const handleSubmitWithOrder = () => handleSubmit(sectionOrder)

  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId)
  }

  const sections = useMemo(
    () => [
      {
        id: 'branding',
        title: 'Branding + Media',
        description: 'Hero banner and logo assets',
      },
      {
        id: 'hero',
        title: 'Hero Headline',
        description: 'Primary headline and CTA copy',
      },
      {
        id: 'description',
        title: 'Story + Metrics',
        description: 'Long-form description and highlight stats',
      },
      {
        id: 'products',
        title: 'Product Grid',
        description: 'Auto-populated from your dashboard inventory',
      },
    ],
    []
  )

  const sectionBlocks: Record<string, JSX.Element> = {
    branding: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <BasicInfoSection
          data={data}
          handleImageChange={handleImageChange}
          uploadingPaths={uploadingPaths}
        />
      </div>
    ),
    hero: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <HeroSection data={data} updateField={updateField} />
      </div>
    ),
    description: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <DescriptionSection data={data} updateField={updateField} />
      </div>
    ),
    products: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <div className='space-y-2'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Products
          </p>
          <h3 className='text-lg font-semibold text-slate-900'>
            Product grid is auto-populated
          </h3>
          <p className='text-sm text-slate-600'>
            Upload products from your dashboard to show them in the live
            template preview.
          </p>
        </div>
      </div>
    ),
  }

  return (
    <>
         <Header fixed>
            <Search />
            <div className='ms-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ConfigDrawer />
              <ProfileDropdown />
            </div>
          </Header>
      <Toaster position='top-right' />

      <TemplatePageLayout
        title='Website Builder'
        description='Craft your storefront hero, brand story, and key metrics. Drag sections to reorder and sync to preview how products appear on your live template.'
        activeKey='home'
        actions={
          <>
            <Button
              onClick={() => setOpen(true)}
              className='rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800'
            >
              <Rocket className='h-4 w-4' /> Deploy
            </Button>
            <Button
              variant='outline'
              onClick={() => setDomainOpen(true)}
              className='rounded-full border-slate-300'
            >
              <Wand2 className='h-4 w-4' /> Connect Domain
            </Button>
            {previewUrl ? (
              <a href={previewUrl} target='_blank' rel='noopener noreferrer'>
                <Button
                  variant='outline'
                  className='rounded-full border-slate-300'
                >
                  <Link2 className='h-4 w-4' /> Open Preview
                </Button>
              </a>
            ) : null}
          </>
        }
        preview={
          <TemplatePreviewPanel
            title='Live Website Preview'
            subtitle='Sync to refresh the right-side preview'
            src={previewUrl}
            fullPreviewUrl={fullPreviewUrl}
            onSync={handleSubmitWithOrder}
            isSyncing={isSubmitting}
            syncDisabled={uploadingPaths.size > 0}
            vendorId={vendor_id}
            page='home'
            previewData={data}
            sectionOrder={sectionOrder}
            onSelectSection={handleSelectSection}
          />
        }
      >
        <ThemeSettingsSection data={data} updateField={updateField} />

        <TemplateSectionOrder
          title='Home Sections'
          items={sections}
          order={sectionOrder}
          setOrder={setSectionOrder}
        />

        {sectionOrder.map((sectionId) => (
          <div
            key={sectionId}
            data-editor-section={sectionId}
            className={
              selectedSection === sectionId
                ? 'rounded-3xl ring-2 ring-slate-900/15 ring-offset-2 ring-offset-slate-50'
                : undefined
            }
          >
            {sectionBlocks[sectionId]}
          </div>
        ))}

        <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
          <SubmitSection
            submitStatus={submitStatus}
            isSubmitting={isSubmitting}
            uploadingPaths={uploadingPaths}
            handleSubmit={handleSubmitWithOrder}
          />
        </div>
      </TemplatePageLayout>

      <DeploymentModal
        open={open}
        setOpen={setOpen}
        isDeploying={isDeploying}
        deployMessage={deployMessage}
        handleDeploy={handleDeploy}
        handleCancel={handleCancel}
      />
      <DomainModal open={domainOpen} setOpen={setDomainOpen} />
    </>
  )
}
