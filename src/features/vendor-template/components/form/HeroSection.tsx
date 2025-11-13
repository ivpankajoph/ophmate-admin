import { Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Type {
  data: any
  updateField: any
}
export function HeroSection({ data, updateField }: Type) {
  return (
    <div className='rounded-xl border bg-white p-5 shadow-sm'>
      <h2 className='mb-4 flex items-center border-b pb-2 text-xl font-semibold text-gray-800'>
        <div className='mr-3 rounded-lg bg-indigo-100 p-2'>
          <Zap className='h-5 w-5 text-indigo-600' />
        </div>
        Hero Section
      </h2>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Hero Title
          </label>
          <Input
            placeholder='Enter hero title'
            value={data.components.home_page.header_text}
            onChange={(e) =>
              updateField(
                ['components', 'home_page', 'header_text'],
                e.target.value
              )
            }
            className='h-12'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            Hero Subtitle
          </label>
          <Input
            placeholder='Enter hero subtitle'
            value={data.components.home_page.header_text_small}
            onChange={(e) =>
              updateField(
                ['components', 'home_page', 'header_text_small'],
                e.target.value
              )
            }
            className='h-12'
          />
        </div>
      </div>

      <div className='mt-4 space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          Header Button Text
        </label>
        <Input
          placeholder='Button text'
          value={data.components.home_page.button_header}
          onChange={(e) =>
            updateField(
              ['components', 'home_page', 'button_header'],
              e.target.value
            )
          }
          className='h-12'
        />
      </div>
    </div>
  )
}
