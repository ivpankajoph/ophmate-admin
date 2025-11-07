'use client'

import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductForm } from './hooks/useProductForm'
import ProductDetailsSection from './components/ProductDetailsSection'
import CategorySection from './components/CategorySection'
import ImageUploadSection from './components/ImageUploadSection'
import VariantSection from './components/VariantSection'
import SpecificationSection from './components/SpecificationSection'


export default function ProductCreator() {
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, reset } = useForm()
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
            <ProductDetailsSection register={register} />
            <CategorySection state={state} actions={actions} />
            <ImageUploadSection state={state} actions={actions} />
            <VariantSection state={state} actions={actions} />
            <SpecificationSection state={state} actions={actions} />

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
