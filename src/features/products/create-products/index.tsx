'use client'

import { useForm } from 'react-hook-form'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import CategorySection from './components/CategorySection'
import FAQBuilderPage from './components/Faq'
import ImageUploadSection from './components/ImageUploadSection'
import ProductDetailsSection from './components/ProductDetailsSection'
import SpecificationSection from './components/SpecificationSection'
import VariantSection from './components/VariantSection'
import { useProductForm } from './hooks/useProductForm'

export default function ProductCreator() {
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, reset, watch, setValue } = useForm()
  const { state, actions, onSubmit } = useProductForm(dispatch, reset)

  // Generate quantity options (1 to 20)
  const quantityOptions = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <div className='space-y-10 p-6'>
      <h2 className='text-center text-3xl font-bold text-gray-800'>
        Create New Product
      </h2>

      <Card className='border border-gray-200 shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold text-gray-700'>
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
            {/* Quantity Selection Section */}

            <ProductDetailsSection
              register={register}
              watch={watch}
              setValue={setValue}
            />
            <CategorySection state={state} actions={actions} />
            <ImageUploadSection state={state} actions={actions} />
            <VariantSection state={state} actions={actions} />
            <SpecificationSection />
            <FAQBuilderPage />
            <div className='mb-6'>
              <Label
                htmlFor='product-quantity'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Quantity
              </Label>
              <select
                id='product-quantity'
                className='border-input bg-background w-fit rounded-md border px-3 py-2 text-sm'
                defaultValue='1'
              >
                {quantityOptions.map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? '' : ''}
                  </option>
                ))}
              </select>
              <p className='mt-2 text-sm text-gray-500'>
                Select how many product entries you want to create at once
              </p>
            </div>
            <Button
              type='submit'
              className='mt-6 w-full py-6 text-lg transition-all'
            >
              Create Product
              {watch('quantity') && parseInt(watch('quantity')) > 1 ? 's' : ''}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}