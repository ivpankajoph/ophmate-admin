import { useEffect, useRef, useState } from 'react'
import {
  ExternalLink,
  RefreshCcw,
  Smartphone,
  Monitor,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TemplatePreviewPanelProps {
  title: string
  subtitle: string
  src?: string
  fullPreviewUrl?: string
  onSync?: () => Promise<void> | void
  isSyncing?: boolean
  syncDisabled?: boolean
  vendorId?: string
  page?: 'home' | 'about' | 'contact' | 'full'
  previewData?: unknown
  sectionOrder?: string[]
  onSelectSection?: (sectionId: string) => void
}

export function TemplatePreviewPanel({
  title,
  subtitle,
  src,
  fullPreviewUrl,
  onSync,
  isSyncing,
  syncDisabled,
  vendorId,
  page = 'full',
  previewData,
  sectionOrder,
  onSelectSection,
}: TemplatePreviewPanelProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [frameKey, setFrameKey] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleRefresh = () => setFrameKey((prev) => prev + 1)

  const handleSync = async () => {
    if (!onSync) {
      handleRefresh()
      return
    }
    await onSync()
    handleRefresh()
  }

  useEffect(() => {
    if (!iframeRef.current || !vendorId || !previewData) return
    const timeout = window.setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'template-preview-update',
          vendorId,
          page,
          payload: previewData,
          sectionOrder,
        },
        window.location.origin
      )
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [previewData, sectionOrder, vendorId, page])

  useEffect(() => {
    if (!onSelectSection) return

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as {
        type?: string
        vendorId?: string
        page?: string
        sectionId?: string
      }
      if (data?.type !== 'template-editor-select') return
      if (vendorId && data.vendorId && data.vendorId !== vendorId) return
      if (data.page && page && data.page !== page) return
      if (!data.sectionId) return
      onSelectSection(data.sectionId)
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelectSection, vendorId, page])

  return (
    <div className='rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.4)] backdrop-blur'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
            <p className='text-xs text-slate-500'>{subtitle}</p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className={cn(
                'rounded-full border-slate-200',
                device === 'desktop' &&
                  'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
              )}
              onClick={() => setDevice('desktop')}
            >
              <Monitor className='h-4 w-4' />
            </Button>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className={cn(
                'rounded-full border-slate-200',
                device === 'mobile' &&
                  'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
              )}
              onClick={() => setDevice('mobile')}
            >
              <Smartphone className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            className='border-slate-300'
            onClick={handleSync}
            disabled={syncDisabled || isSyncing}
          >
            <RefreshCcw className='h-4 w-4' />
            {isSyncing ? 'Syncing...' : 'Sync + Refresh'}
          </Button>
          {fullPreviewUrl ? (
            <a
              href={fullPreviewUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                type='button'
                variant='outline'
                className='border-slate-300'
              >
                <ExternalLink className='h-4 w-4' /> Full Preview
              </Button>
            </a>
          ) : null}
        </div>

        <div className='rounded-2xl border border-slate-200 bg-slate-50 p-2'>
          {src ? (
            <div
              className={cn(
                'overflow-hidden rounded-xl bg-white shadow-inner',
                device === 'mobile'
                  ? 'mx-auto w-full max-w-[360px]'
                  : 'w-full'
              )}
            >
              <iframe
                key={frameKey}
                title='Template preview'
                src={src}
                className={cn(
                  'w-full border-0',
                  device === 'mobile' ? 'h-[640px] rounded-[32px]' : 'h-[720px]'
                )}
                ref={iframeRef}
              />
            </div>
          ) : (
            <div className='flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white text-center text-sm text-slate-500'>
              <p>Preview will appear once vendor data is available.</p>
              <p>Save the template to load the live preview.</p>
            </div>
          )}
        </div>

        <p className='text-xs text-slate-500'>
          Live preview reflects the latest saved template and products.
        </p>
      </div>
    </div>
  )
}
