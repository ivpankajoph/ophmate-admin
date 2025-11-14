'use client'

import { useForm } from 'react-hook-form'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  return (
    <div className='mx-auto w-5xl max-w-7xl space-y-10 p-6'>
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

            <Button
              type='submit'
              className='mt-6 w-full py-6 text-lg transition-all'
            >
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
