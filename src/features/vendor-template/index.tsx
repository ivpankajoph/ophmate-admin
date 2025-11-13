'use client'

import { useState } from 'react'
import { Rocket, Link2 } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { DomainModal } from './components/DomainModel'
import { BasicInfoSection } from './components/form/BasicInfoSection'
import { DeploymentModal } from './components/form/DeploymentModal'
import { DescriptionSection } from './components/form/DescriptionSection'
import { HeroSection } from './components/form/HeroSection'
import { SubmitSection } from './components/form/SubmitSection'
import { useTemplateForm } from './components/hooks/useTemplateForm'

export default function TemplateForm() {
  const {
    data,
    updateField,
    handleImageChange,
    handleSubmit,
    vendor_id,
    vendor_weburl,
    uploadingPaths,
    submitStatus,
    isSubmitting,
    open,
    setOpen,
    handleDeploy,
    isDeploying,
    deployMessage,
    handleCancel,
  } = useTemplateForm()

  const [domainOpen, setDomainOpen] = useState(false) // ⬅ New modal state

  const VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND = import.meta.env
    .VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND

  return (
    <div className='space-y-6'>
      <Toaster position='top-right' />

      <Card className='border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg shadow-gray-200/50'>
        <CardHeader className='relative p-6 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
            <div>
              <CardTitle className='text-3xl font-extrabold text-slate-800'>
                Template Builder
              </CardTitle>
              <p className='mt-1 text-slate-600'>
                Customize your storefront and deploy instantly
              </p>
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={() => setOpen(true)}
                className='bg-emerald-500 text-white'
              >
                <Rocket className='mr-2 h-4 w-4' /> Deploy Website
              </Button>

              <a
                href={`${VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND}?vendor_id=${vendor_id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button variant='outline' className='text-indigo-600'>
                  <Link2 className='mr-2 h-4 w-4' /> Preview
                </Button>
              </a>

              <Button variant='outline' onClick={() => setDomainOpen(true)}>
                Connect Domain
              </Button>
            </div>
          </div>

          <div className='mt-3 text-sm text-slate-700'>
            Your website:{' '}
            <span className='text-indigo-600'>{vendor_weburl}</span>
          </div>
        </CardHeader>

        <CardContent className='space-y-6 p-6'>
          {/* ⬇ Split into components */}
          <BasicInfoSection
            data={data}
            handleImageChange={handleImageChange}
            uploadingPaths={uploadingPaths}
          />

          <HeroSection data={data} updateField={updateField} />

          <DescriptionSection data={data} updateField={updateField} />

          <SubmitSection
            submitStatus={submitStatus}
            isSubmitting={isSubmitting}
            uploadingPaths={uploadingPaths}
            handleSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {/* Deployment Modal */}
      <DeploymentModal
        open={open}
        setOpen={setOpen}
        isDeploying={isDeploying}
        deployMessage={deployMessage}
        handleDeploy={handleDeploy}
        handleCancel={handleCancel}
      />
      <DomainModal open={domainOpen} setOpen={setDomainOpen} />
    </div>
  )
}
