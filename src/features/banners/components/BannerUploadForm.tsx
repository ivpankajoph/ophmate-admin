'use client'

import React, { useState } from 'react'
import { AppDispatch } from '@/store'
import { createBanner } from '@/store/slices/admin/bannerSlice'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Upload, X, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadImage } from '@/features/vendor-template/helper/fileupload'

export default function BannerUploadForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: any) => state.banners)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const image = imageUrl
    if (!image) {
      Swal.fire({
        icon: 'warning',
        title: 'No Image Selected',
        text: 'Please select an image before uploading.',
        confirmButtonColor: '#1f2937',
      })
      return
    }

    try {
      await dispatch(
        createBanner({ title, description, image_url: image } as any)
      ).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Banner Created',
        text: 'Your banner has been uploaded successfully!',
        confirmButtonColor: '#1f2937',
      })

      setTitle('')
      setDescription('')
      setImageUrl(null)
      setPreview(null)
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err?.message || 'Something went wrong. Try again!',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const uploadedUrl = await uploadImage(file, 'banner_images')
      setImageUrl(uploadedUrl)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const uploadedUrl = uploadImage(file, 'banner_images')
      uploadedUrl.then(url => {
        setImageUrl(url)
        setPreview(URL.createObjectURL(file))
      })
    }
  }

  const handleReplaceImage = () => {
    setImageUrl(null)
    setPreview(null)
  }

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-950"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-xl dark:bg-gray-800 dark:border-gray-700",
        "overflow-hidden transition-all duration-300 hover:shadow-2xl"
      )}>
        <CardHeader className="pb-8 pt-8 px-8">
          <div className="text-center">
            <CardTitle className="text-2xl font-medium text-gray-800 dark:text-gray-100 tracking-tight">
              Create Banner
            </CardTitle>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Upload an image and add a title to create a promotional banner.
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-7 px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11 rounded-2xl border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300 dark:bg-gray-750 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="rounded-2xl border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300 dark:bg-gray-750 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Banner Image
              </Label>

              {!preview ? (
                <div
                  className={cn(
                    "relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-300 hover:border-gray-400 dark:bg-gray-750 dark:border-gray-600",
                    isDragging && "border-gray-400 bg-gray-100 dark:border-gray-500 dark:bg-gray-700"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    JPG, PNG — up to 10MB
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-750">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-end justify-end p-4">
                      <div className="flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 rounded-full px-3 py-1.5 backdrop-blur-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                    onClick={handleReplaceImage}
                    aria-label="Replace image"
                  >
                    <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 rounded-2xl font-medium text-sm tracking-wide transition-all duration-300",
                "bg-gray-900 text-white hover:bg-gray-800 focus:ring-1 focus:ring-gray-400",
                "dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300",
                loading && "cursor-not-allowed opacity-70"
              )}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Create Banner"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}