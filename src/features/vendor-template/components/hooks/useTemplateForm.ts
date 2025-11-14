import { useState, useEffect } from 'react'
import axios from 'axios'
import { AppDispatch } from '@/store'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { fetchVendorProfile } from '@/store/slices/vendor/profileSlice'
import toast from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { initialData } from '../../data'
import { updateFieldImmutable, uploadImage } from './utils'

export function useTemplateForm() {
  const [data, setData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [uploadingPaths, setUploadingPaths] = useState(new Set())
  const [open, setOpen] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployMessage, setDeployMessage] = useState('Deploying website...')

  const vendor_id = useSelector((s: any) => s.auth?.user?.id)
  const vendor_weburl = useSelector(
    (s: any) => s.vendorprofile?.profile?.vendor?.bound_url
  )

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchVendorProfile())
  }, [])

  // Update any nested value
  const updateField = (path: string[], value: any) => {
    setData((prev) => updateFieldImmutable(prev, path, value))
  }

  // Handle image update + cloudinary upload
  const handleImageChange = async (path: string[], file: File | null) => {
    const pathKey = path.join('.')

    if (!file) {
      updateField(path, '')
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
      return
    }

    setUploadingPaths((prev) => new Set(prev).add(pathKey))

    try {
      const url = await uploadImage(file)
      updateField(path, url || '')
    } finally {
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
    }
  }

  // Save template
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = {
        vendor_id,
        components: data.components,
      }

      const res = await axios.put(`${BASE_URL}/templates/home`, payload)

      if (res.status === 200 || res.status === 201) {
        setSubmitStatus('success')
        toast.success('Template saved!')
      } else {
        throw new Error()
      }
    } catch {
      setSubmitStatus('error')
      toast.error('Save failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Deployment + binding
  async function bindURL(url: string) {
    try {
      await axios.put(`${BASE_URL}/vendor/bind-url`, {
        url,
        vendor_id,
      })
      toast.success('URL bound successfully!')
    } catch {
      toast.error('URL binding failed')
    }
  }
  const token = useSelector((state: any) => state?.auth?.token)

  const handleDeploy = async () => {
    setIsDeploying(true)
    toast.loading('Starting deployment...', { id: 'deploy' })
    try {
      const response = await axios.post(
        `${BASE_URL}/templates/deploy`,
        {
          projectName: `sellerslogin-${vendor_id}`,
          templatePath: `../vendor-template`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'stream', // IMPORTANT for Node streaming
        }
      )

      let serviceUrl = null
      let buffer = ''

      response.data.on('data', (chunk: any) => {
        const text = chunk.toString()
        buffer += text

        setDeployMessage((prev) => prev + text)

        const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.run\.app/)
        if (match) serviceUrl = match[0]
      })

      await new Promise((resolve) => response.data.on('end', resolve))

      toast.success('Deployment complete', { id: 'deploy' })

      if (serviceUrl) await bindURL(serviceUrl)
    } catch (err) {
      console.error(err)
      toast.error('Deployment failed', { id: 'deploy' })
    } finally {
      setIsDeploying(false)
    }
  }

  // Cancel Deployment
  const handleCancel = async () => {
    try {
      await axios.post(`${BASE_URL}/templates/deploy/cancel`)
      toast.success('Deployment canceled')
    } catch {
      toast.error('Cancel failed')
    }
  }

  return {
    data,
    setData,
    updateField,
    handleImageChange,
    handleSubmit,
    uploadingPaths,
    submitStatus,
    isSubmitting,
    vendor_id,
    vendor_weburl,
    open,
    setOpen,
    isDeploying,
    deployMessage,
    handleDeploy,
    handleCancel,
  }
}
