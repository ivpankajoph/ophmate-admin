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
import { uploadImage } from '@/features/vendor-template/helper/fileupload'

export default function BannerUploadForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: any) => state.banners)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const image = imageUrl
    if (!image) {
      Swal.fire({
        icon: 'warning',
        title: 'No Image Selected',
        text: 'Please select an image before uploading.',
        confirmButtonColor: '#2563eb',
      })
      return
    }

    try {
      await dispatch(
        createBanner({ title, description, image_url: image } as any)
      ).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Banner Created 🎉',
        text: 'Your banner has been uploaded successfully!',
        confirmButtonColor: '#16a34a',
      })

      setTitle('')
      setDescription('')
      setImageUrl(null)
      setPreview(null)
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed 😢',
        text: err?.message || 'Something went wrong. Try again!',
        confirmButtonColor: '#dc2626',
      })
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const uploadedUrl  = await uploadImage(file, 'banner_images')
      setImageUrl(uploadedUrl)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleReplaceImage = () => {
    setImageUrl(null)
    setPreview(null)
  }

  return (
    <motion.div
      className='flex min-h-screen items-center justify-center p-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className='w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-xl'>
        <CardHeader className='pb-0 text-center'>
          <CardTitle className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent'>
            Create Banner
          </CardTitle>
          <p className='mt-1 text-sm text-gray-500'>
            Add promotional banners with image preview
          </p>
        </CardHeader>

        <CardContent className='mt-4'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700'>Title</label>
              <Input
                placeholder='Enter banner title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className='mt-1'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>
                Description
              </label>
              <Textarea
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className='mt-1 resize-none'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>
                Image Upload
              </label>
              {!preview ? (
                <Input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='mt-1 cursor-pointer'
                />
              ) : (
                <div className='relative mt-2'>
                  <img
                    src={preview}
                    alt='Preview'
                    className='h-48 w-full rounded-md border object-cover shadow-sm'
                  />
                  <div className='absolute top-2 right-2'>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={handleReplaceImage}
                      className='text-xs'
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
            >
              {loading ? 'Uploading...' : 'Create Banner'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
