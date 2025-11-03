/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { Link2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { initialData, TemplateData } from '../../data'
import { ImageInput } from './ImageInput'

export function TemplateForm() {
  const [data, setData] = useState<TemplateData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const updateField = (path: string[], value: any) => {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      let current: any = clone
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return clone
    })
  }

  const vendor_id = useSelector((state: any) => state.auth.user.id)

  const handleImageChange = async (path: string[], file: File | null) => {
    if (!file) {
      updateField(path, '')
      return
    }

    try {
      const url = ''
      updateField(path, url)
    } catch (err) {
      console.error('Image upload failed:', err)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = {
        name: data.name,
        vendor_id,
        previewImage: data.previewImage,
        components: data.components,
      }

      const res = await axios.post(`${BASE_URL}/templates`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200 || res.status === 201) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex gap-4'>
            Template Preview{' '}
            <a
              className='w-fit'
              href={`http://localhost:3000/template-preview?vendor_id=${vendor_id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Link2 className='-mt-1' />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Basic Info */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Company Name / Shop Name</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => updateField(['name'], e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <ImageInput
                label='Banner Image'
                name='previewImage'
                value={data.previewImage}
                onChange={(file) => handleImageChange(['previewImage'], file)}
                isFileInput={true}
              />
            </div>
          </div>

          {/* Logo */}
          <div className='space-y-2'>
            <ImageInput
              label='Company Logo'
              name='logo'
              value={data.components.logo}
              onChange={(file) =>
                handleImageChange(['components', 'logo'], file)
              }
              isFileInput={true}
            />
          </div>

          {/* Home Page */}
          <Separator />
          <h2 className='text-lg font-semibold'>Home Page Section 1</h2>
          <div className='space-y-4'>
            <Input
              placeholder='Hero Title'
              value={data.components.home_page.header_text}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'header_text'],
                  e.target.value
                )
              }
            />
            <Input
              placeholder='Hero SubTitle'
              value={data.components.home_page.header_text_small}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'header_text_small'],
                  e.target.value
                )
              }
            />
            <Input
              placeholder='Text on Header Button'
              value={data.components.home_page.button_header}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'button_header'],
                  e.target.value
                )
              }
            />
            <Separator />
            <h2 className='text-lg font-semibold'>Home Page Section 2</h2>
            <Textarea
              placeholder='Large Description'
              value={data.components.home_page.description.large_text}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'description', 'large_text'],
                  e.target.value
                )
              }
            />
            <Textarea
              placeholder='Summary'
              value={data.components.home_page.description.summary}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'description', 'summary'],
                  e.target.value
                )
              }
            />

            <div className='grid grid-cols-2 gap-2'>
              <Input
                placeholder='Percent (e.g. 90)'
                value={
                  data.components.home_page.description.percent
                    .percent_in_number
                }
                onChange={(e) =>
                  updateField(
                    [
                      'components',
                      'home_page',
                      'description',
                      'percent',
                      'percent_in_number',
                    ],
                    e.target.value
                  )
                }
              />
              <Input
                placeholder='Percent Label'
                value={
                  data.components.home_page.description.percent.percent_text
                }
                onChange={(e) =>
                  updateField(
                    [
                      'components',
                      'home_page',
                      'description',
                      'percent',
                      'percent_text',
                    ],
                    e.target.value
                  )
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <Input
                placeholder='Sold Number'
                value={data.components.home_page.description.sold.sold_number}
                onChange={(e) =>
                  updateField(
                    [
                      'components',
                      'home_page',
                      'description',
                      'sold',
                      'sold_number',
                    ],
                    e.target.value
                  )
                }
              />
              <Input
                placeholder='Sold Label'
                value={data.components.home_page.description.sold.sold_text}
                onChange={(e) =>
                  updateField(
                    [
                      'components',
                      'home_page',
                      'description',
                      'sold',
                      'sold_text',
                    ],
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Contact Page */}

          {/* FAQ Section */}
       

          <Separator />
          <div className='flex items-center justify-between'>
            <div>
              {submitStatus === 'success' && (
                <p className='text-green-600'>
                  ✅ Template created successfully!
                </p>
              )}
              {submitStatus === 'error' && (
                <p className='text-red-600'>
                  ❌ Failed to submit. Check console.
                </p>
              )}
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Create Template'}
            </Button>
          </div>

          {/* Optional JSON Preview */}
          <details className='text-xs'>
            <summary>View Payload Structure</summary>
            <pre className='bg-muted mt-2 max-h-60 overflow-auto rounded p-2'>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
