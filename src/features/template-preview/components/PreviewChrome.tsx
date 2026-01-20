import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PreviewChromeProps {
  vendorId: string
  logoUrl?: string
  buttonLabel?: string
  active: 'home' | 'about' | 'contact'
  children: ReactNode
  footer?: ReactNode
}

export function PreviewChrome({
  vendorId,
  logoUrl,
  buttonLabel,
  active,
  children,
  footer,
}: PreviewChromeProps) {
  const navItems = [
    { key: 'home', label: 'Home', href: `/template/${vendorId}` },
    { key: 'about', label: 'About', href: `/template/${vendorId}/about` },
    { key: 'contact', label: 'Contact', href: `/template/${vendorId}/contact` },
  ] as const

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.12),transparent_45%)] font-manrope text-slate-900'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/80 to-transparent' />

      <header className='relative z-10 border-b border-white/60 bg-white/80 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 overflow-hidden rounded-full border border-white bg-slate-900 text-white shadow'>
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt='Brand logo'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-xs font-semibold'>
                  OPH
                </div>
              )}
            </div>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.32em] text-slate-500'>
                Storefront Preview
              </p>
              <p className='text-lg font-semibold text-slate-900'>
                Vendor Template
              </p>
            </div>
          </div>

          <nav className='hidden items-center gap-3 md:flex'>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  active === item.key
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm'>
            {buttonLabel || 'Shop Now'}
          </div>
        </div>
      </header>

      <main className='relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6'>
        {children}
      </main>

      {footer ? (
        <footer className='border-t border-white/60 bg-white/80 py-10'>
          <div className='mx-auto max-w-6xl px-4 sm:px-6'>{footer}</div>
        </footer>
      ) : null}
    </div>
  )
}
