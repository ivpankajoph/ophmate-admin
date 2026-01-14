// src/components/ProductCreate/index.tsx
import React, { useState, useEffect } from 'react'
import { AppDispatch } from '@/store'
import { getAllCategories } from '@/store/slices/admin/categorySlice'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { generateSpecifications, generateWithAI } from './aiHelpers'
import { deleteFromCloudinary, uploadToCloudinary } from './cloudinary'
import Step1BasicInfo from './components/Step1BasicInfo'
import Step2Images from './components/Step2Images'
import Step3Specifications from './components/Step3Specifications'
import Step4SEO from './components/Step4SEO'
import Step5Variants from './components/Step5Variants'
import Step6FAQs from './components/Step6FAQs'

// Interfaces
interface ImageUpload {
  url: string
  publicId: string
  uploading?: boolean
  tempId?: string
}

interface Variant {
  variantAttributes: Record<string, string>
  actualPrice: number
  finalPrice: number
  stockQuantity: number
  variantsImageUrls: ImageUpload[]
  variantMetaTitle: string
  variantMetaDescription: string
  variantMetaKeywords: string[]
  isActive: boolean
}

interface FAQ {
  question: string
  answer: string
}

interface ProductFormData {
  productName: string
  productCategory: string
  productSubCategories: string[]
  brand: string
  shortDescription: string
  description: string
  defaultImages: ImageUpload[]
  specifications: Record<string, string>[]
  isAvailable: boolean
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  variants: Variant[]
  faqs: FAQ[]
}

// Specification templates by category
const SPECIFICATION_TEMPLATES: Record<string, string[]> = {
  electronics: [
    'brand',
    'model',
    'color',
    'weight',
    'dimensions',
    'warranty',
    'power',
    'connectivity',
  ],
  clothing: [
    'brand',
    'size',
    'color',
    'material',
    'gender',
    'season',
    'careInstructions',
    'sleeveLength',
  ],
  furniture: [
    'brand',
    'material',
    'color',
    'dimensions',
    'weight',
    'assemblyRequired',
  ],
  default: ['warranty', 'returnPeriod'],
}

const ProductCreateForm: React.FC = () => {
  // Redux state (only for categories and auth)
  const categories = useSelector(
    (state: any) => state.categories?.categories || []
  )
  const AUTH_TOKEN = useSelector((state: any) => state.auth?.token || '')

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    productCategory: '',
    productSubCategories: [],
    brand: '',
    shortDescription: '',
    description: '',
    defaultImages: [],
    specifications: [{}],
    isAvailable: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    variants: [],
    faqs: [],
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([])
  const [specificationKeys, setSpecificationKeys] = useState<string[]>(
    SPECIFICATION_TEMPLATES.default
  )
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [metaKeywordInput, setMetaKeywordInput] = useState('')

  // ✅ For dynamic variant attributes & keywords
  const [tempAttributeKey, setTempAttributeKey] = useState('')
  const [tempAttributeValue, setTempAttributeValue] = useState('')
  const [variantMetaKeywordInput, setVariantMetaKeywordInput] = useState('')
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getAllCategories())
  }, [dispatch])

  useEffect(() => {
    if (!selectedCategoryId) {
      setFilteredSubcategories([])
      return
    }

    const fetchSubcategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_PUBLIC_API_URL}/subcategories/category/${selectedCategoryId}`
        )

        if (!res.ok) {
          console.error('Failed to fetch subcategories: HTTP', res.status)
          setFilteredSubcategories([])
          return
        }

        const json = await res.json()

        if (json.success && Array.isArray(json.data)) {
          setFilteredSubcategories(json.data)
        } else {
          console.warn('Unexpected API response format:', json)
          setFilteredSubcategories([])
        }
      } catch (err) {
        console.error('Error fetching subcategories:', err)
        setFilteredSubcategories([])
      }
    }

    fetchSubcategories() // ✅ Call the function
  }, [selectedCategoryId])

  // Update specification keys based on category
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(
        (cat: any) => cat._id === selectedCategoryId
      )
      if (category) {
        const template =
          SPECIFICATION_TEMPLATES[category.name.toLowerCase()] ||
          SPECIFICATION_TEMPLATES.default
        setSpecificationKeys(template)
        const initialSpec: Record<string, string> = {}
        template.forEach((key) => (initialSpec[key] = ''))
        setFormData((prev) => ({
          ...prev,
          specifications: [initialSpec],
        }))
      }
    }
  }, [selectedCategoryId, categories])

  // --- AI Handlers for Variants ---
  const handleGenerateVariantMetaTitle = async (vIndex: number) => {
    const variant = formData.variants[vIndex]
    const attrText = Object.entries(variant.variantAttributes)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    const context = `Product: ${formData.productName}, Brand: ${formData.brand}, Attributes: ${attrText}`

    setAiLoading((prev) => ({ ...prev, [`variantMetaTitle_${vIndex}`]: true }))

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products/generate-field`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'metaTitle', context }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setFormData((prev) => {
          const newVariants = [...prev.variants]
          newVariants[vIndex].variantMetaTitle = data.data
          return { ...prev, variants: newVariants }
        })
      }
    } catch (err) {
      alert('AI generation failed')
    } finally {
      setAiLoading((prev) => ({
        ...prev,
        [`variantMetaTitle_${vIndex}`]: false,
      }))
    }
  }

  const handleGenerateVariantMetaDescription = async (vIndex: number) => {
    const variant = formData.variants[vIndex]
    const attrText = Object.entries(variant.variantAttributes)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')
    const context = `Product: ${formData.productName}, Brand: ${formData.brand}, Attributes: ${attrText}, Short: ${formData.shortDescription}`

    setAiLoading((prev) => ({
      ...prev,
      [`variantMetaDescription_${vIndex}`]: true,
    }))

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products/generate-field`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field: 'metaDescription', context }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setFormData((prev) => {
          const newVariants = [...prev.variants]
          newVariants[vIndex].variantMetaDescription = data.data
          return { ...prev, variants: newVariants }
        })
      }
    } catch (err) {
      alert('AI generation failed')
    } finally {
      setAiLoading((prev) => ({
        ...prev,
        [`variantMetaDescription_${vIndex}`]: false,
      }))
    }
  }

  // --- Image Handlers ---
  const handleDefaultImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setFormData((prev) => ({
      ...prev,
      defaultImages: [
        ...prev.defaultImages,
        ...files.map((file) => ({
          url: URL.createObjectURL(file),
          publicId: '',
          uploading: true,
        })),
      ],
    }))

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file)
        if (!result) {
          setFormData((prev) => ({
            ...prev,
            defaultImages: prev.defaultImages.filter(
              (img) => img.url !== URL.createObjectURL(file)
            ),
          }))
        }
        return result
      })
    )

    setFormData((prev) => {
      const newImages = [...prev.defaultImages]
      let startIndex = newImages.length - files.length
      uploadedImages.forEach((img, i) => {
        if (img) {
          newImages[startIndex + i] = img
        }
      })
      return { ...prev, defaultImages: newImages }
    })
  }

  const handleDeleteDefaultImage = async (index: number) => {
    const publicId = formData.defaultImages[index]?.publicId
    if (publicId) {
      await deleteFromCloudinary(publicId)
    }
    const newImages = [...formData.defaultImages]
    newImages.splice(index, 1)
    setFormData({ ...formData, defaultImages: newImages })
  }

  // --- AI Handlers ---
  const generateShortDesc = () =>
    generateWithAI(
      'shortDescription',
      `Product: ${formData.productName}, Brand: ${formData.brand}`,
      setAiLoading,
      setFormData
    )

  const generateDescription = () =>
    generateWithAI(
      'description',
      `Product: ${formData.productName}, Brand: ${formData.brand}, Short: ${formData.shortDescription}`,
      setAiLoading,
      setFormData
    )

  const handleGenerateSpecifications = () =>
    generateSpecifications(
      formData,
      selectedCategoryId,
      categories,
      specificationKeys,
      setAiLoading,
      setFormData
    )

  // --- Variant Handlers ---
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantAttributes: {},
          actualPrice: 0,
          finalPrice: 0,
          stockQuantity: 0,
          variantsImageUrls: [],
          variantMetaTitle: '',
          variantMetaDescription: '',
          variantMetaKeywords: [],
          isActive: true,
        },
      ],
    }))
  }

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...formData.variants]
    newVariants.splice(index, 1)
    setFormData((prev) => ({ ...prev, variants: newVariants }))
  }

  const handleVariantFieldChange = (
    index: number,
    field: keyof Variant,
    value: any
  ) => {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData((prev) => ({ ...prev, variants: newVariants }))
  }

  const handleVariantImageUpload = async (
    variantIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    e.target.value = '' // prevent reselect bug

    const tempImages = files.map((file, idx) => ({
      url: URL.createObjectURL(file),
      publicId: '',
      uploading: true,
      tempId: `upload-${variantIndex}-${Date.now()}-${idx}`,
    }))

    setFormData((prev) => {
      const variants = [...prev.variants]
      variants[variantIndex] = {
        ...variants[variantIndex],
        variantsImageUrls: [
          ...variants[variantIndex].variantsImageUrls,
          ...tempImages,
        ],
      }
      return { ...prev, variants }
    })

    for (let i = 0; i < files.length; i++) {
      const result = await uploadToCloudinary(files[i])
      if (!result) continue

      setFormData((prev) => {
        const variants = [...prev.variants]
        const images = [...variants[variantIndex].variantsImageUrls]

        const idx = images.findIndex(
          (img) => img.tempId === tempImages[i].tempId
        )

        if (idx !== -1) {
          images[idx] = {
            url: result.url,
            publicId: result.publicId,
            uploading: false,
          }
        }

        variants[variantIndex] = {
          ...variants[variantIndex],
          variantsImageUrls: images,
        }

        return { ...prev, variants }
      })
    }
  }

  const handleVariantImageDelete = async (
    variantIndex: number,
    imageIndex: number
  ) => {
    const publicId =
      formData.variants[variantIndex].variantsImageUrls[imageIndex]?.publicId
    if (publicId) {
      await deleteFromCloudinary(publicId)
    }
    const newVariants = [...formData.variants]
    newVariants[variantIndex].variantsImageUrls.splice(imageIndex, 1)
    setFormData((prev) => ({ ...prev, variants: newVariants }))
  }

  const addAttributeToVariant = (vIndex: number) => {
    if (!tempAttributeKey.trim() || !tempAttributeValue.trim()) return
    setFormData((prev) => {
      const variants = [...prev.variants]
      variants[vIndex].variantAttributes[tempAttributeKey.trim()] =
        tempAttributeValue.trim()
      return { ...prev, variants }
    })
    setTempAttributeKey('')
    setTempAttributeValue('')
  }

  const removeAttributeFromVariant = (vIndex: number, key: string) => {
    setFormData((prev) => {
      const variants = [...prev.variants]
      delete variants[vIndex].variantAttributes[key]
      return { ...prev, variants }
    })
  }

  const addMetaKeywordToVariant = (vIndex: number) => {
    if (!variantMetaKeywordInput.trim()) return
    setFormData((prev) => {
      const variants = [...prev.variants]
      variants[vIndex].variantMetaKeywords.push(variantMetaKeywordInput.trim())
      return { ...prev, variants }
    })
    setVariantMetaKeywordInput('')
  }

  const removeMetaKeywordFromVariant = (vIndex: number, kwIndex: number) => {
    setFormData((prev) => {
      const variants = [...prev.variants]
      variants[vIndex].variantMetaKeywords.splice(kwIndex, 1)
      return { ...prev, variants }
    })
  }

  // --- FAQ Handlers ---
  const handleAddFAQ = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }))
  }

  const handleRemoveFAQ = (index: number) => {
    const newFaqs = [...formData.faqs]
    newFaqs.splice(index, 1)
    setFormData((prev) => ({ ...prev, faqs: newFaqs }))
  }

  const handleFAQChange = (
    index: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    const newFaqs = [...formData.faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setFormData((prev) => ({ ...prev, faqs: newFaqs }))
  }

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      const payload = {
        ...formData,
        productCategory: selectedCategoryId,
        specifications: formData.specifications[0],
      }

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error('Failed to create product')
      alert('Product created successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  // --- Render Current Step ---
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            filteredSubcategories={filteredSubcategories}
            aiLoading={aiLoading}
            generateWithAI={generateShortDesc}
            generateDescription={generateDescription}
          />
        )
      case 2:
        return (
          <Step2Images
            defaultImages={formData.defaultImages}
            onUpload={handleDefaultImageUpload}
            onDelete={handleDeleteDefaultImage}
          />
        )
      case 3:
        return (
          <Step3Specifications
            specificationKeys={specificationKeys}
            specifications={formData.specifications}
            isAvailable={formData.isAvailable}
            aiLoading={aiLoading.specifications}
            onToggleAvailable={() =>
              setFormData((prev) => ({
                ...prev,
                isAvailable: !prev.isAvailable,
              }))
            }
            onSpecChange={(key, val) => {
              const specs = [...formData.specifications]
              specs[0] = { ...specs[0], [key]: val }
              setFormData((prev) => ({ ...prev, specifications: specs }))
            }}
            onGenerate={handleGenerateSpecifications}
          />
        )
      case 4:
        return (
          <Step4SEO
            metaTitle={formData.metaTitle}
            metaDescription={formData.metaDescription}
            metaKeywords={formData.metaKeywords}
            metaKeywordInput={metaKeywordInput}
            aiLoading={aiLoading}
            onMetaTitleChange={(val) =>
              setFormData((prev) => ({ ...prev, metaTitle: val }))
            }
            onMetaDescChange={(val) =>
              setFormData((prev) => ({ ...prev, metaDescription: val }))
            }
            onKeywordInputChange={setMetaKeywordInput}
            onAddKeyword={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (metaKeywordInput.trim()) {
                  setFormData((prev) => ({
                    ...prev,
                    metaKeywords: [
                      ...prev.metaKeywords,
                      metaKeywordInput.trim(),
                    ],
                  }))
                  setMetaKeywordInput('')
                }
              }
            }}
            onRemoveKeyword={(index) => {
              setFormData((prev) => ({
                ...prev,
                metaKeywords: prev.metaKeywords.filter((_, i) => i !== index),
              }))
            }}
            onGenerateTitle={() =>
              generateWithAI(
                'metaTitle',
                `Product: ${formData.productName}`,
                setAiLoading,
                setFormData
              )
            }
            onGenerateDesc={() =>
              generateWithAI(
                'metaDescription',
                `Product: ${formData.productName}, ${formData.shortDescription}`,
                setAiLoading,
                setFormData
              )
            }
          />
        )
      case 5:
        return (
          <Step5Variants
            variants={formData.variants}
            tempAttributeKey={tempAttributeKey}
            tempAttributeValue={tempAttributeValue}
            metaKeywordInput={variantMetaKeywordInput}
            onTempAttributeKeyChange={setTempAttributeKey}
            onTempAttributeValueChange={setTempAttributeValue}
            onMetaKeywordInputChange={setVariantMetaKeywordInput}
            onAddVariant={handleAddVariant}
            onRemoveVariant={handleRemoveVariant}
            onAddAttributeToVariant={addAttributeToVariant}
            onRemoveAttributeFromVariant={removeAttributeFromVariant}
            onVariantFieldChange={handleVariantFieldChange}
            onVariantImageUpload={handleVariantImageUpload}
            onVariantImageDelete={handleVariantImageDelete}
            onAddMetaKeywordToVariant={addMetaKeywordToVariant}
            onRemoveMetaKeywordFromVariant={removeMetaKeywordFromVariant}
            aiLoading={aiLoading}
            onGenerateVariantMetaTitle={handleGenerateVariantMetaTitle}
            onGenerateVariantMetaDescription={
              handleGenerateVariantMetaDescription
            }
          />
        )
      case 6:
        return (
          <Step6FAQs
            faqs={formData.faqs}
            onFAQChange={handleFAQChange}
            onAddFAQ={handleAddFAQ}
            onRemoveFAQ={handleRemoveFAQ}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8'>
      <div className='mx-auto max-w-5xl'>
        <div className='rounded-xl bg-white p-8 shadow-lg'>
          <h1 className='mb-8 text-3xl font-bold text-gray-900'>
            Create New Product
          </h1>

          {/* Progress Bar */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              {['Basic', 'Images', 'Specs', 'SEO', 'Variants', 'FAQs'].map(
                (step, i) => (
                  <div key={i} className='flex flex-col items-center'>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                        currentStep === i + 1
                          ? 'bg-blue-600 text-white'
                          : currentStep > i + 1
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className='mt-1 text-xs text-gray-600'>{step}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <form>
            {renderCurrentStep()}

            <div className='mt-8 flex justify-between'>
              <button
                type='button'
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className='rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Previous
              </button>
            </div>
          </form>
          {currentStep < 6 ? (
            <button
              type='button'
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className='mt-5 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700'
            >
              Next
            </button>
          ) : (
            <button
              type='submit'
              disabled={loading}
              onClick={handleSubmit}
              className='mt-5 flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50'
            >
              {loading && <Loader2 className='h-5 w-5 animate-spin' />}
              <span>{loading ? 'Creating...' : 'Create Product'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCreateForm
