import { type TemplateData } from '@/features/vendor-template/data'
import { JSX } from 'react'

interface AboutPreviewProps {
  template: TemplateData
  sectionOrder: string[]
}

export function AboutPreview({ template, sectionOrder }: AboutPreviewProps) {
  const about = template.components?.about_page

  if (!about) {
    return null
  }

  const sections: Record<string, JSX.Element> = {
    hero: (
      <section className='relative overflow-hidden rounded-3xl border border-white/60 bg-slate-900 text-white'>
        <div className='absolute inset-0 opacity-40'>
          {about.hero?.backgroundImage ? (
            <img
              src={about.hero.backgroundImage}
              alt='About hero background'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black' />
          )}
        </div>
        <div className='relative z-10 space-y-4 px-8 py-16'>
          <p className='text-xs font-semibold uppercase tracking-[0.32em] text-white/70'>
            About Us
          </p>
          <h1 className='text-3xl font-semibold sm:text-5xl'>
            {about.hero?.title || 'We craft products with purpose.'}
          </h1>
          <p className='max-w-2xl text-base text-white/80'>
            {about.hero?.subtitle ||
              'Share the story behind your brand and highlight what makes you different.'}
          </p>
        </div>
      </section>
    ),
    story: (
      <section className='grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='space-y-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Our Story
          </p>
          <h2 className='text-2xl font-semibold text-slate-900'>
            {about.story?.heading || 'Designed for modern marketplaces.'}
          </h2>
          <div className='space-y-3 text-sm text-slate-600'>
            {(about.story?.paragraphs?.length
              ? about.story.paragraphs
              : [
                  'Add your brand journey here to build trust with shoppers.',
                  'Share the milestone that inspired your storefront.',
                ]
            ).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-slate-100'>
          {about.story?.image ? (
            <img
              src={about.story.image}
              alt='Story'
              className='h-full w-full object-cover'
            />
          ) : (
            <div className='flex h-full min-h-[260px] items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
              Story Image
            </div>
          )}
        </div>
      </section>
    ),
    values: (
      <section className='space-y-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Values
          </p>
          <h3 className='text-2xl font-semibold text-slate-900'>
            Core principles that guide us
          </h3>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {(about.values?.length ? about.values : [{ icon: '', title: '', description: '' }, { icon: '', title: '', description: '' }, { icon: '', title: '', description: '' }]).map(
            (value, idx) => (
              <div
                key={`${value.title || 'value'}-${idx}`}
                className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
              >
                <div className='mb-3 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white'>
                  {value.icon || 'Value'}
                </div>
                <h4 className='text-lg font-semibold text-slate-900'>
                  {value.title || 'Customer-first'}
                </h4>
                <p className='mt-2 text-sm text-slate-600'>
                  {value.description ||
                    'Explain what drives this value for your brand.'}
                </p>
              </div>
            )
          )}
        </div>
      </section>
    ),
    team: (
      <section className='space-y-4'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
            Team
          </p>
          <h3 className='text-2xl font-semibold text-slate-900'>
            Meet the people behind the brand
          </h3>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {(about.team?.length ? about.team : [{ name: '', role: '', image: '' }, { name: '', role: '', image: '' }, { name: '', role: '', image: '' }]).map((member, idx) => (
            <div
              key={`${member.name || 'member'}-${idx}`}
              className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'
            >
              <div className='mb-4 h-48 overflow-hidden rounded-xl bg-slate-100'>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name || 'Team member'}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-slate-400'>
                    Photo
                  </div>
                )}
              </div>
              <h4 className='text-lg font-semibold text-slate-900'>
                {member.name || 'Team Member'}
              </h4>
              <p className='text-sm text-slate-500'>
                {member.role || 'Role'}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    stats: (
      <section className='grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:grid-cols-3'>
        {(about.stats?.length ? about.stats : [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }]).map((stat, idx) => (
          <div key={`${stat.label || 'stat'}-${idx}`} className='text-center'>
            <p className='text-3xl font-semibold text-slate-900'>
              {stat.value || '25+'}
            </p>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-slate-400'>
              {stat.label || 'Projects'}
            </p>
          </div>
        ))}
      </section>
    ),
  }

  const defaultOrder = ['hero', 'story', 'values', 'team', 'stats']
  const order = sectionOrder.length ? sectionOrder : defaultOrder

  return (
    <div className='space-y-10'>
      {order.map((key) => (
        <div key={key}>{sections[key] || null}</div>
      ))}
    </div>
  )
}
