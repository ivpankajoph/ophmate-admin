/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { categoryAttributes } from '@/config/categoryAttributes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Upload, Plus } from 'lucide-react'
import { useSelector } from 'react-redux'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { createProduct } from '@/store/slices/vendor/productSlice'

type FormData = {
  name: string
  description: string
  short_description: string
  discount_percent: number
  stock: number
  sku:string
  status: string
  brand: string
  images: FileList
  videos: FileList
}

export default function ProductCreator() {
    const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, reset } = useForm<FormData>()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<keyof typeof categoryAttributes | ''>('')
  const [variants, setVariants] = useState<any[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const categories = useSelector((state: any) => state?.categories?.categories) || []
  const subcategories = useSelector((state: any) => state?.subcategories?.subcategories) || []

  console.log(
    
  "sdadsa",subcategories
  )

   const onAddVariant = () => {
    const attrs = selectedSubcategory && categoryAttributes[selectedSubcategory]
      ? categoryAttributes[selectedSubcategory]
      : []
    const newVariant: Record<string, any> = {}
    attrs.forEach(attr => (newVariant[attr.key] = ''))
    newVariant.price = 0
    newVariant.stock = 0
    newVariant.sku = ''
    setVariants(prev => [...prev, newVariant])
  }


  const onRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const onUpdateVariant = (index: number, key: string, value: any) => {
    const updated = [...variants]
    updated[index][key] = value
    setVariants(updated)
  }



const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (files) {
    const newFiles = Array.from(files)
    setImageFiles(prev => [...prev, ...newFiles])
    setImagePreviews(prev => [
      ...prev,
      ...newFiles.map(file => URL.createObjectURL(file))
    ])
  }
}

const handleRemoveImage = (index: number) => {
  setImagePreviews(prev => prev.filter((_, i) => i !== index))
  setImageFiles(prev => prev.filter((_, i) => i !== index))
}


  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setVideoFiles(Array.from(files))
  }

const onSubmit: SubmitHandler<FormData> = (data) => {
    const attrs = selectedSubcategory && categoryAttributes[selectedSubcategory]
      ? categoryAttributes[selectedSubcategory]
      : []

    const formData = new FormData()

    formData.append('productName', data.name)
    formData.append('productCategory', selectedCategory)
    formData.append('productSubCategory', selectedSubcategory)
    formData.append('short_description', data.short_description)
    formData.append('description', data.description)
    formData.append('isAvailable', 'true') // hardcoded, you can replace with actual

    // Append variants as JSON string
    const variantPayload = variants.map(v => ({
      sku: v.sku,
      attributes: attrs.reduce((acc: Record<string, any>, attr) => {
        acc[attr.key] = v[attr.key]
        return acc
      }, {}),
      price: v.price,
      actual_price: v.price, // or your logic
      stockQuantity: v.stock,
      discount_percent: v.discount_percent ?? 0
    }))
    formData.append('variants', JSON.stringify(variantPayload))

    // Append images
    imageFiles.forEach(file => formData.append('images', file))
    // Append videos
    videoFiles.forEach(file => formData.append('videos', file))

    // Dispatch Redux Thunk
    dispatch(createProduct(formData))

    // Reset form
    reset()
    setVariants([])
    setSelectedCategory('')
    setSelectedSubcategory('')
    setImageFiles([])
    setVideoFiles([])
  }

  return (
    <div className="mx-auto w-5xl max-w-7xl p-6 space-y-10">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Create New Product
      </h2>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Product Details
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Product Info Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Product Name</Label>
                <Input {...register('name')} placeholder="e.g. Premium Cotton T-Shirt" />
              </div>

              <div>
                <Label>Short Description</Label>
                <Input
                  {...register('short_description')}
                  placeholder="e.g. 100% cotton, soft and breathable"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Full Description</Label>
                <Textarea {...register('description')} placeholder="Enter full product description" />
              </div>

              <div>
                <Label>Discount (%)</Label>
                <Input type="number" {...register('discount_percent')} />
              </div>

              <div>
                <Label>Brand</Label>
                <Input type="text" {...register('brand')} />
              </div>
            </section>

            {/* Category Dropdown */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Select Category</Label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setSelectedSubcategory('')
                    setVariants([])
                  }}
                  className="w-full rounded-md border border-gray-300 p-2 text-base"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Select Subcategory</Label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value as keyof typeof categoryAttributes)
                    setVariants([])
                  }}
                  className="w-full rounded-md border border-gray-300 p-2 text-base"
                  disabled={!selectedCategory}
                >
                  <option value="">-- Select Subcategory --</option>
                  {subcategories.map((sub: any) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* Image Upload */}
            <section className="space-y-4">
              <Label>Upload Product Images</Label>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((src, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 shadow-sm"
                  >
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </motion.div>
                ))}

                <button
                  type="button"
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 hover:border-blue-500 transition"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span>Upload</span>
                </button>

                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </section>

            {/* Video Upload */}
            <section>
              <Label>Upload Product Videos (optional)</Label>
              <Input type="file" multiple accept="video/*" onChange={handleVideoChange} />
            </section>

            {/* Variants Section */}
            {selectedSubcategory && (
              <section className="border-t border-gray-200 pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-700">Variants</h3>
                  <Button type="button" variant="outline" onClick={onAddVariant}>
                    <Plus className="w-4 h-4 mr-1" /> Add Variant
                  </Button>
                </div>

                <AnimatePresence>
                  {variants.length > 0 ? (
                    variants.map((variant, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="border border-gray-300 shadow-sm bg-gray-50 mb-4">
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                            {categoryAttributes[selectedSubcategory]?.map((attr) => (
                              <div key={attr.key}>
                                <Label>{attr.label}</Label>
                                {attr.type === 'select' ? (
                                  <select
                                    value={variant[attr.key]}
                                    onChange={(e) => onUpdateVariant(index, attr.key, e.target.value)}
                                    className="w-full rounded-md border border-gray-300 p-2"
                                  >
                                    <option value="">Select {attr.label}</option>
                                    {'options' in attr ? (attr as { options: string[] }).options.map((opt: string) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    )) : null}
                                  </select>
                                ) : (
                                  <Input
                                    type={attr.type}
                                    placeholder={attr.label}
                                    value={variant[attr.key]}
                                    onChange={(e) => onUpdateVariant(index, attr.key, e.target.value)}
                                  />
                                )}
                              </div>
                            ))}

                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={variant.price}
                                onChange={(e) => onUpdateVariant(index, 'price', e.target.value)}
                              />
                            </div>

                            <div>
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => onUpdateVariant(index, 'stock', e.target.value)}
                              />
                            </div>

                            <div>
                              <Label>SKU</Label>
                              <Input
                                value={variant.sku}
                                onChange={(e) => onUpdateVariant(index, 'sku', e.target.value)}
                              />
                            </div>

                            <div className="col-span-full flex justify-end mt-2">
                              <Button type="button" variant="destructive" onClick={() => onRemoveVariant(index)}>
                                <Trash2 className="w-4 h-4 mr-1" /> Remove Variant
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No variants added yet.</p>
                  )}
                </AnimatePresence>
              </section>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full mt-6 py-6 text-lg transition-all">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
