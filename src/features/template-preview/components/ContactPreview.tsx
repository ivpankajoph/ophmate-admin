import { Mail, MapPin, Phone } from 'lucide-react'
import { type TemplateData } from '@/features/vendor-template/data'
import { JSX } from 'react'

interface ContactPreviewProps {
  template: TemplateData
  sectionOrder: string[]
}

const getMapEmbedUrl = (lat: string, lng: string) => {
  const latNum = parseFloat(lat)
  const lngNum = parseFloat(lng)
  if (!latNum || !lngNum) return null

  const delta = 0.02
  const left = lngNum - delta
  const right = lngNum + delta
  const top = latNum + delta
  const bottom = latNum - delta
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latNum}%2C${lngNum}`
}

export function ContactPreview({
  template,
  sectionOrder,
}: ContactPreviewProps) {
  const contact = template.components.contact_page
  const section2 = contact.section_2 || {
    hero_title: '',
    hero_subtitle: '',
    hero_title2: '',
    hero_subtitle2: '',
    lat: '',
    long: '',
  }

  const mapUrl = getMapEmbedUrl(section2.lat, section2.long)

  const sections: Record<string, JSX.Element> = {
    hero: (
      <section className='relative overflow-hidden rounded-3xl border border-white/60 bg-slate-900 text-white'>
        <div className='absolute inset-0 opacity-40'>
          {contact.hero.backgroundImage ? (
            <img
              src={contact.hero.backgroundImage}
              alt='Contact hero background'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black' />
          )}
        </div>
        <div className='relative z-10 space-y-4 px-8 py-16'>
          <p className='text-xs font-semibold uppercase tracking-[0.32em] text-white/70'>
            Contact
          </p>
          <h1 className='text-3xl font-semibold sm:text-5xl'>
            {contact.hero.title || 'Reach out to our team.'}
          </h1>
          <p className='max-w-2xl text-base text-white/80'>
            {contact.hero.subtitle ||
              'Let customers know the best way to get in touch.'}
          </p>
        </div>
      </section>
    ),
    details: (
      <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Visit
          </p>
          <h2 className='text-2xl font-semibold text-slate-900'>
            {section2.hero_title || 'Come visit our storefront.'}
          </h2>
          <p className='text-sm text-slate-600'>
            {section2.hero_subtitle ||
              'Add your address and directions so customers can find you quickly.'}
          </p>
          <div className='space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-slate-500' />
              <span>{section2.hero_title2 || 'Main store location'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-slate-500' />
              <span>{section2.hero_subtitle2 || '+91 00000 00000'}</span>
            </div>
          </div>
        </div>
        <div className='space-y-3'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Contact Info
          </p>
          <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600'>
            {(contact.contactInfo?.length
              ? contact.contactInfo
              : [
                  { icon: 'map-pin', title: 'Visit Us', details: '' },
                  { icon: 'phone', title: 'Call Us', details: '' },
                  { icon: 'mail', title: 'Email', details: '' },
                ]
            ).map((item, idx) => (
              <div key={`${item.title}-${idx}`} className='flex items-start gap-3'>
                <div className='mt-1 h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs'>
                  {item.icon?.toString().slice(0, 2).toUpperCase() || 'IN'}
                </div>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
                    {item.title || 'Info'}
                  </p>
                  <p className='text-sm text-slate-600'>
                    {item.details || 'Add details in the contact form.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    map: (
      <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-slate-100'>
          {mapUrl ? (
            <iframe
              title='Map preview'
              src={mapUrl}
              className='h-[360px] w-full border-0'
            />
          ) : (
            <div className='flex h-[360px] items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
              Map preview
            </div>
          )}
        </div>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Coordinates
          </p>
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600'>
            <p>Latitude: {section2.lat || '0.0000'}</p>
            <p>Longitude: {section2.long || '0.0000'}</p>
          </div>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600'>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
              Send a message
            </p>
            <div className='space-y-2'>
              {(contact.contactForm?.fields?.length
                ? contact.contactForm.fields
                : [
                    { label: 'Full Name' },
                    { label: 'Email Address' },
                    { label: 'Message' },
                  ]
              ).map((field, idx) => (
                <div key={`${field.label}-${idx}`} className='rounded-lg border border-slate-200 bg-slate-50 px-3 py-2'>
                  {field.label}
                </div>
              ))}
              <div className='flex items-center gap-2 text-xs text-slate-500'>
                <Mail className='h-4 w-4' />
                {contact.contactForm?.submitButtonText || 'Send Message'}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }

  const defaultOrder = ['hero', 'details', 'map']
  const order = sectionOrder.length ? sectionOrder : defaultOrder

  return (
    <div className='space-y-10'>
      {order.map((key) => (
        <div key={key}>{sections[key] || null}</div>
      ))}
    </div>
  )
}
