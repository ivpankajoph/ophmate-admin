/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { AppDispatch } from '@/store'
import { getAllCategories } from '@/store/slices/admin/categorySlice'
import {
  fetchSubcategories,
  getSubcategoriesByCategory,
} from '@/store/slices/admin/subcategorySlice'
import { createProduct } from '@/store/slices/vendor/productSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Upload, Plus, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

type FormData = {
  name: string
  description: string
  short_description: string
  brand: string
}

export default function ProductCreator() {
  const dispatch = useDispatch<AppDispatch>()
  const { register, handleSubmit, reset } = useForm<FormData>()

  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  ) // ✅ multiple
  const [customCategory, setCustomCategory] = useState<string>('')
  const [customSubcategory, setCustomSubcategory] = useState<string>('')
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false)
  const [isAddingCustomSubcategory, setIsAddingCustomSubcategory] =
    useState(false)
  const [variants, setVariants] = useState<any[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [variantImageFiles, setVariantImageFiles] = useState<
    Record<number, File[]>
  >({})
  const [variantImagePreviews, setVariantImagePreviews] = useState<
    Record<number, string[]>
  >({})
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  const imageInputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    dispatch(getAllCategories())
    dispatch(fetchSubcategories())
  }, [dispatch])
  const categories =
    useSelector((state: any) => state?.categories?.categories) || []
  const allSubcategories =
    useSelector((state: any) => state?.subcategories?.subcategories) || []

  // Fetch subcategories when a predefined category is selected
  useEffect(() => {
    // Only fetch if selectedCategory is a valid ObjectId (24 hex chars)

    if (selectedCategoryId && !isAddingCustomCategory) {
      dispatch(getSubcategoriesByCategory(selectedCategoryId))
    } else {
      // Clear subcategories if custom or invalid
      setSelectedSubcategories([])
      setVariants([])
    }
  }, [selectedCategory, isAddingCustomCategory, dispatch])
  const filteredSubcategories = allSubcategories.filter(
    (sub: any) => sub.category_id === selectedCategoryId
  )

  // Add custom category
  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setSelectedCategory(customCategory.trim())
      setIsAddingCustomCategory(false)
      setCustomCategory('')
      setSelectedSubcategories([])
      setVariants([])
    }
  }

  // Add custom subcategory
  const handleAddCustomSubcategory = () => {
    if (customSubcategory.trim()) {
      const newSub = customSubcategory.trim()
      if (!selectedSubcategories.includes(newSub)) {
        setSelectedSubcategories((prev) => [...prev, newSub])
      }
      setIsAddingCustomSubcategory(false)
      setCustomSubcategory('')
      setVariants([])
    }
  }

  // Remove a subcategory
  const removeSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) => prev.filter((s) => s !== sub))
  }

  // Add new variant with empty attributes
  const onAddVariant = () => {
    const newVariant = {
      sku: '',
      price: '',
      discount_percent: '0',
      stock: '',
      attributes: [{ key: '', value: '' }], // ✅ dynamic key-value
    }
    setVariants((prev) => [...prev, newVariant])
  }

  const onRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
    setVariantImageFiles((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
    setVariantImagePreviews((prev) => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  // Update variant field (sku, price, etc.)
  const onUpdateVariantField = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  // Update attribute key/value
  const onUpdateAttribute = (
    variantIndex: number,
    attrIndex: number,
    type: 'key' | 'value',
    value: string
  ) => {
    const updated = [...variants]
    updated[variantIndex].attributes[attrIndex][type] = value
    setVariants(updated)
  }

  // Add new attribute pair to variant
  const onAddAttribute = (variantIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].attributes.push({ key: '', value: '' })
    setVariants(updated)
  }

  // Remove attribute from variant
  const onRemoveAttribute = (variantIndex: number, attrIndex: number) => {
    const updated = [...variants]
    updated[variantIndex].attributes = updated[variantIndex].attributes.filter(
      (_: any, i: number) => i !== attrIndex
    )
    setVariants(updated)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setImageFiles((prev) => [...prev, ...newFiles])
      setImagePreviews((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData()

    formData.append('productName', data.name)
    formData.append('productCategory', selectedCategory)
    formData.append('productSubCategory', JSON.stringify(selectedSubcategories))
    formData.append('brand', data.brand || '')
    formData.append('short_description', data.short_description)
    formData.append('description', data.description)
    formData.append('isAvailable', 'true')

    // Build variants with dynamic attributes
    const variantPayload = variants.map((v) => {
      const attributes: Record<string, string> = {}
      v.attributes.forEach((attr: { key: string; value: string }) => {
        if (attr.key.trim()) {
          attributes[attr.key.trim()] = attr.value.trim() || ''
        }
      })

      return {
        sku: v.sku,
        attributes,
        price: parseFloat(v.price) || 0,
        discount_percent: parseFloat(v.discount_percent) || 0,
        stockQuantity: parseInt(v.stock, 10) || 0,
      }
    })

    formData.append('variants', JSON.stringify(variantPayload))

    // Global images
    imageFiles.forEach((file) => {
      formData.append('globalImages', file)
    })

    // Variant images
    variants.forEach((_, idx) => {
      const files = variantImageFiles[idx] || []
      files.forEach((file) => {
        formData.append(`images-${idx}`, file)
      })
    })

    // 🚀 Dispatch and wait for result
    const resultAction: any = await dispatch(createProduct(formData))

    if (createProduct.fulfilled.match(resultAction)) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: resultAction.payload.message || 'Product created successfully!',
        timer: 2000,
        showConfirmButton: false,
      })

      // Reset fields
      reset()
      setSelectedCategory('')
      setSelectedSubcategories([])
      setVariants([])
      setImageFiles([])
      setImagePreviews([])
      setVariantImageFiles({})
      setVariantImagePreviews({})
      setIsAddingCustomCategory(false)
      setIsAddingCustomSubcategory(false)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text:
          (resultAction.payload && resultAction.payload.message) ||
          'Something went wrong while creating the product.',
      })
    }
  }

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
            {/* Product Info */}
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

            {/* Category & Subcategories (Multiple + Custom) */}
            <section className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Category */}
              <div>
                <Label>Category</Label>
                <div className='space-y-2'>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const val = e.target.value

                      if (val === '__add_custom__') {
                        setIsAddingCustomCategory(true)
                        setSelectedCategory('')
                        return
                      }

                      const selected = categories.find(
                        (cat: any) => cat.id === val
                      )

                      if (selected) {
                        setSelectedCategory(selected.name) // ✅ Save NAME for sending
                        setSelectedCategoryId(selected.id) // ✅ Save ID for fetching subcategories
                      }

                      setIsAddingCustomCategory(false)
                      setSelectedSubcategories([])
                      setVariants([])
                    }}
                    className='w-full rounded-md border border-gray-300 p-2 text-base'
                  >
                    <option value=''>-- Select or Add Category --</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                    <option value='__add_custom__'>
                      + Add Custom Category
                    </option>
                  </select>

                  {isAddingCustomCategory && (
                    <div className='mt-2 flex gap-2'>
                      <Input
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder='New category name'
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleAddCustomCategory()
                        }
                      />
                      <Button
                        type='button'
                        size='sm'
                        onClick={handleAddCustomCategory}
                      >
                        Add
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddingCustomCategory(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {selectedCategory && !isAddingCustomCategory && (
                    <p className='mt-1 text-sm text-gray-600'>
                      Category: <strong>{selectedCategory}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Subcategories (Multiple) */}
              <div>
                <Label>Subcategories (Select or Add)</Label>
                <div className='space-y-2'>
                  <select
                    value=''
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === '__add_custom_sub__') {
                        setIsAddingCustomSubcategory(true)
                      } else if (val) {
                        if (!selectedSubcategories.includes(val)) {
                          setSelectedSubcategories((prev) => [...prev, val])
                        }
                      }
                    }}
                    className='w-full rounded-md border border-gray-300 p-2 text-base'
                    disabled={!selectedCategory}
                  >
                    <option value=''>-- Add Subcategory --</option>
                    {filteredSubcategories.map((sub: any) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                    <option value='__add_custom_sub__'>
                      + Add Custom Subcategory
                    </option>
                  </select>

                  {isAddingCustomSubcategory && (
                    <div className='mt-2 flex gap-2'>
                      <Input
                        value={customSubcategory}
                        onChange={(e) => setCustomSubcategory(e.target.value)}
                        placeholder='New subcategory name'
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleAddCustomSubcategory()
                        }
                      />
                      <Button
                        type='button'
                        size='sm'
                        onClick={handleAddCustomSubcategory}
                      >
                        Add
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => setIsAddingCustomSubcategory(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Selected subcategories as tags */}
                  {selectedSubcategories.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {selectedSubcategories.map((sub, idx) => (
                        <div
                          key={idx}
                          className='flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800'
                        >
                          {sub}
                          <button
                            type='button'
                            onClick={() => removeSubcategory(sub)}
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Global Images */}
            <section className='space-y-4'>
              <Label>Upload Global Product Images</Label>
              <div className='flex flex-wrap gap-4'>
                {imagePreviews.map((src, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className='relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300 shadow-sm'
                  >
                    <img
                      src={src}
                      alt='preview'
                      className='h-full w-full object-cover'
                    />
                    <button
                      type='button'
                      className='absolute top-1 right-1 rounded-full bg-white p-1 shadow'
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className='h-4 w-4 text-red-600' />
                    </button>
                  </motion.div>
                ))}

                <button
                  type='button'
                  className='flex h-32 w-32 flex-col items-center justify-center rounded-lg border-2 border-dashed text-gray-500 transition hover:border-blue-500 hover:text-gray-700'
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className='mb-1 h-6 w-6' />
                  <span>Upload</span>
                </button>

                <input
                  ref={imageInputRef}
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                />
              </div>
            </section>

            {/* Variants with Dynamic Attributes */}
            {selectedSubcategories.length > 0 && (
              <section className='space-y-6 border-t border-gray-200 pt-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-semibold text-gray-700'>
                    Variants
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onAddVariant}
                  >
                    <Plus className='mr-1 h-4 w-4' /> Add Variant
                  </Button>
                </div>

                <AnimatePresence>
                  {variants.length > 0 ? (
                    variants.map((variant, vIndex) => (
                      <motion.div
                        key={vIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className='mb-4 border border-gray-300 bg-gray-50 shadow-sm'>
                          <CardContent className='space-y-4 p-4'>
                            {/* SKU, Price, Stock, Discount */}
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                              <div>
                                <Label>SKU</Label>
                                <Input
                                  value={variant.sku}
                                  onChange={(e) =>
                                    onUpdateVariantField(
                                      vIndex,
                                      'sku',
                                      e.target.value
                                    )
                                  }
                                  placeholder='e.g. SM-WH-BLK-01'
                                />
                              </div>
                              <div>
                                <Label>Price</Label>
                                <Input
                                  type='number'
                                  step='0.01'
                                  value={variant.price}
                                  onChange={(e) =>
                                    onUpdateVariantField(
                                      vIndex,
                                      'price',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>Discount (%)</Label>
                                <Input
                                  type='number'
                                  min='0'
                                  max='100'
                                  value={variant.discount_percent}
                                  onChange={(e) =>
                                    onUpdateVariantField(
                                      vIndex,
                                      'discount_percent',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label>Stock</Label>
                                <Input
                                  type='number'
                                  value={variant.stock}
                                  onChange={(e) =>
                                    onUpdateVariantField(
                                      vIndex,
                                      'stock',
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Dynamic Attributes */}
                            <div>
                              <div className='mb-2 flex items-center justify-between'>
                                <Label>Attributes (Key-Value Pairs)</Label>
                                <Button
                                  type='button'
                                  size='sm'
                                  variant='outline'
                                  onClick={() => onAddAttribute(vIndex)}
                                >
                                  <Plus className='mr-1 h-3 w-3' /> Add
                                  Attribute
                                </Button>
                              </div>

                              <div className='space-y-2'>
                                {variant.attributes.map(
                                  (attr: any, aIndex: number) => (
                                    <div key={aIndex} className='flex gap-2'>
                                      <Input
                                        placeholder='Key (e.g. color)'
                                        value={attr.key}
                                        onChange={(e) =>
                                          onUpdateAttribute(
                                            vIndex,
                                            aIndex,
                                            'key',
                                            e.target.value
                                          )
                                        }
                                        className='flex-1'
                                      />
                                      <Input
                                        placeholder='Value (e.g. Black)'
                                        value={attr.value}
                                        onChange={(e) =>
                                          onUpdateAttribute(
                                            vIndex,
                                            aIndex,
                                            'value',
                                            e.target.value
                                          )
                                        }
                                        className='flex-1'
                                      />
                                      <Button
                                        type='button'
                                        variant='destructive'
                                        size='icon'
                                        onClick={() =>
                                          onRemoveAttribute(vIndex, aIndex)
                                        }
                                      >
                                        <Trash2 className='h-3 w-3' />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Variant Images */}
                            <div>
                              <Label>Variant Images</Label>
                              <div className='mt-1 flex flex-wrap gap-2'>
                                {variantImagePreviews[vIndex]?.map(
                                  (src, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className='relative h-20 w-20'
                                    >
                                      <img
                                        src={src}
                                        alt='variant preview'
                                        className='h-full w-full rounded border object-cover'
                                      />
                                      <button
                                        type='button'
                                        className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white'
                                        onClick={() => {
                                          const newPreviews = [
                                            ...(variantImagePreviews[vIndex] ||
                                              []),
                                          ]
                                          const newFiles = [
                                            ...(variantImageFiles[vIndex] ||
                                              []),
                                          ]
                                          newPreviews.splice(imgIndex, 1)
                                          newFiles.splice(imgIndex, 1)
                                          setVariantImagePreviews((prev) => ({
                                            ...prev,
                                            [vIndex]: newPreviews,
                                          }))
                                          setVariantImageFiles((prev) => ({
                                            ...prev,
                                            [vIndex]: newFiles,
                                          }))
                                        }}
                                      >
                                        <Trash2 className='h-3 w-3' />
                                      </button>
                                    </div>
                                  )
                                )}
                                <label className='flex h-20 w-20 cursor-pointer items-center justify-center rounded border-2 border-dashed text-gray-400 hover:border-blue-500'>
                                  <Upload className='h-4 w-4' />
                                  <input
                                    type='file'
                                    multiple
                                    accept='image/*'
                                    className='hidden'
                                    onChange={(e) => {
                                      const files = e.target.files
                                      if (!files) return
                                      const newFiles = Array.from(files)
                                      const newPreviews = newFiles.map((f) =>
                                        URL.createObjectURL(f)
                                      )
                                      setVariantImageFiles((prev) => ({
                                        ...prev,
                                        [vIndex]: [
                                          ...(prev[vIndex] || []),
                                          ...newFiles,
                                        ],
                                      }))
                                      setVariantImagePreviews((prev) => ({
                                        ...prev,
                                        [vIndex]: [
                                          ...(prev[vIndex] || []),
                                          ...newPreviews,
                                        ],
                                      }))
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className='flex justify-end'>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                onClick={() => onRemoveVariant(vIndex)}
                              >
                                <Trash2 className='mr-1 h-3 w-3' /> Remove
                                Variant
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <p className='text-gray-500 italic'>
                      No variants added yet.
                    </p>
                  )}
                </AnimatePresence>
              </section>
            )}

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
