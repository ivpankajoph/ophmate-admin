import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PreviewChrome } from '@/features/template-preview/components/PreviewChrome'
import { useTemplatePreviewData } from '@/features/template-preview/hooks/useTemplatePreviewData'
import {
  getTemplateAuth,
  templateApiFetch,
} from '@/features/template-preview/utils/templateAuth'

type Order = {
  _id: string
  order_number: string
  status: string
  total: number
  createdAt: string
  items: Array<{ product_name: string; quantity: number }>
}

export const Route = createFileRoute('/template/$vendorId/orders')({
  component: TemplateOrders,
})

function TemplateOrders() {
  const { vendorId } = Route.useParams()
  const { template, vendorName, subcategories, categoryMap } = useTemplatePreviewData(
    vendorId,
    'home'
  )
  const auth = getTemplateAuth(vendorId)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const data = await templateApiFetch(vendorId, '/orders')
        setOrders(data.orders || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [vendorId])

  return (
    <PreviewChrome
      vendorId={vendorId}
      logoUrl={template.components.logo}
      vendorName={vendorName || undefined}
      buttonLabel={template.components.home_page?.button_header}
      buttonColor={template.components.home_page?.hero_style?.primaryButtonColor}
      theme={template.components.theme}
      customPages={template.components.custom_pages || []}
      categories={Object.entries(categoryMap).map(([id, name]) => ({
        _id: id,
        name,
      }))}
      subcategories={subcategories}
      active='home'
    >
      {!auth ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm'>
          <h1 className='text-2xl font-semibold text-slate-900'>
            Login required
          </h1>
          <p className='mt-2 text-sm text-slate-500'>
            Sign in to view your orders.
          </p>
          <a
            href={`/template/${vendorId}/login`}
            className='mt-6 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white'
          >
            Go to login
          </a>
        </div>
      ) : (
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-semibold text-slate-900'>My Orders</h1>
            <div className='mt-3 h-1 w-20 rounded-full bg-slate-900/80' />
          </div>

          {loading ? (
            <div className='rounded-lg bg-white p-6 text-center text-gray-500'>
              Loading orders...
            </div>
          ) : orders.length ? (
            <div className='space-y-4'>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'
                >
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                      <p className='text-sm text-slate-500'>Order</p>
                      <p className='text-lg font-semibold text-slate-900'>
                        {order.order_number}
                      </p>
                    </div>
                    <div className='text-sm text-slate-500'>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                    <div className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600'>
                      {order.status}
                    </div>
                    <div className='text-lg font-semibold text-slate-900'>
                      ₹{order.total.toFixed(2)}
                    </div>
                  </div>
                  <div className='mt-4 text-sm text-slate-600'>
                    {order.items.map((item, index) => (
                      <span key={`${order._id}-${index}`}>
                        {item.product_name} x{item.quantity}
                        {index < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500'>
              No orders yet.
            </div>
          )}
        </div>
      )}
    </PreviewChrome>
  )
}
