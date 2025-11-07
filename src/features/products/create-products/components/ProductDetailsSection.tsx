import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ProductDetailsSection({ register }: any) {
  return (
    <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <div>
        <Label>Product Name</Label>
        <Input
          {...register('name', { required: true })}
          placeholder='e.g. Premium Wireless Headphones'
        />
      </div>
      <div>
        <Label>Short Description</Label>
        <Input
          {...register('short_description')}
          placeholder='e.g. High-quality wireless headphones with noise cancellation'
        />
      </div>
      <div className='md:col-span-2'>
        <Label>Full Description</Label>
        <Textarea
          {...register('description')}
          placeholder='Enter full product description'
        />
      </div>
      <div>
        <Label>Brand</Label>
        <Input type='text' {...register('brand')} />
      </div>
    </section>
  )
}
