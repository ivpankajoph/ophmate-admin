/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { Link2 } from 'lucide-react'
import { useSelector } from 'react-redux'
// Adjust path if needed
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrayField } from '../components/form/ArrayField'
import { ImageInput } from '../components/form/ImageInput'
import { initialData, TemplateData } from '../data'
import { VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND } from '@/config'

function VendorTemplateAbout() {
  const [data, setData] = useState<TemplateData>(initialData)
  const [uploadingPaths, setUploadingPaths] = useState<Set<string>>(new Set())

  const vendor_id = useSelector((state: any) => state.auth.user.id)

  // Cloudinary upload helper
  async function uploadImage(file: File): Promise<string | null> {
    try {
      const { data: signatureData } = await axios.get(
        `${BASE_URL}/cloudinary/signature`
      )

      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signatureData.apiKey)
      formData.append('timestamp', signatureData.timestamp)
      formData.append('signature', signatureData.signature)
      formData.append('folder', 'ecommerce')

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        formData
      )

      return uploadRes.data.secure_url
    } catch {
      alert('Failed to upload image. Please try again.')
      return null
    }
  }

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
      const imageUrl = await uploadImage(file)
      updateField(path, imageUrl || '')
    } finally {
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
    }
  }

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/templates/about`, {
        vendor_id,
        components: data.components.about_page,
      })
      alert('About page saved successfully!')
    } catch {
      alert('Failed to save about page.')
    }
  }

  const isUploading = (path: string[]) => uploadingPaths.has(path.join('.'))

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <Card className='p-6'>
        <CardTitle className='flex gap-4'>
          Template Preview{' '}
          <a
            className='w-fit'
            href={`${VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND}/about`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Link2 className='-mt-1' />
          </a>
        </CardTitle>
        <h2 className='text-lg font-semibold'>About Page</h2>
        <div className='space-y-4'>
          {/* Hero Background */}
          <div className='space-y-2'>
            <ImageInput
              label='Hero Background'
              name='aboutHeroBg'
              value={data.components.about_page.hero.backgroundImage}
              onChange={(file) =>
                handleImageChange(
                  ['components', 'about_page', 'hero', 'backgroundImage'],
                  file
                )
              }
              isFileInput={true}
            />
            {isUploading([
              'components',
              'about_page',
              'hero',
              'backgroundImage',
            ]) && <p className='text-muted-foreground text-sm'>Uploading...</p>}
          </div>

          <Input
            value={data.components.about_page.hero.title}
            onChange={(e) =>
              updateField(
                ['components', 'about_page', 'hero', 'title'],
                e.target.value
              )
            }
            placeholder='Hero Title'
          />
          <Input
            value={data.components.about_page.hero.subtitle}
            onChange={(e) =>
              updateField(
                ['components', 'about_page', 'hero', 'subtitle'],
                e.target.value
              )
            }
            placeholder='Hero Subtitle'
          />

          {/* Story */}
          <div className='space-y-2'>
            <Label>Story Paragraphs</Label>
            <ArrayField
              label='Paragraphs'
              items={data.components.about_page.story.paragraphs}
              onAdd={() =>
                updateField(
                  ['components', 'about_page', 'story', 'paragraphs'],
                  [...data.components.about_page.story.paragraphs, '']
                )
              }
              onRemove={(i) => {
                const list = [...data.components.about_page.story.paragraphs]
                list.splice(i, 1)
                updateField(
                  ['components', 'about_page', 'story', 'paragraphs'],
                  list
                )
              }}
              renderItem={(item, idx) => (
                <Textarea
                  value={item}
                  onChange={(e) => {
                    const list = [
                      ...data.components.about_page.story.paragraphs,
                    ]
                    list[idx] = e.target.value
                    updateField(
                      ['components', 'about_page', 'story', 'paragraphs'],
                      list
                    )
                  }}
                />
              )}
            />
          </div>

          <div className='space-y-2'>
            <ImageInput
              label='Story Image'
              name='storyImage'
              value={data.components.about_page.story.image}
              onChange={(file) =>
                handleImageChange(
                  ['components', 'about_page', 'story', 'image'],
                  file
                )
              }
              isFileInput={true}
            />
            {isUploading(['components', 'about_page', 'story', 'image']) && (
              <p className='text-muted-foreground text-sm'>Uploading...</p>
            )}
          </div>

          {/* Core Values */}
          <ArrayField
            label='Core Values'
            items={data.components.about_page.values}
            onAdd={() =>
              updateField(
                ['components', 'about_page', 'values'],
                [
                  ...data.components.about_page.values,
                  { icon: '', title: '', description: '' },
                ]
              )
            }
            onRemove={(i) => {
              const list = [...data.components.about_page.values]
              list.splice(i, 1)
              updateField(['components', 'about_page', 'values'], list)
            }}
            renderItem={(item, idx) => (
              <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
                <Input
                  placeholder='Icon (e.g. leaf)'
                  value={item.icon}
                  onChange={(e) => {
                    const list = [...data.components.about_page.values]
                    list[idx].icon = e.target.value
                    updateField(['components', 'about_page', 'values'], list)
                  }}
                />
                <Input
                  placeholder='Title'
                  value={item.title}
                  onChange={(e) => {
                    const list = [...data.components.about_page.values]
                    list[idx].title = e.target.value
                    updateField(['components', 'about_page', 'values'], list)
                  }}
                />
                <Input
                  placeholder='Description'
                  value={item.description}
                  onChange={(e) => {
                    const list = [...data.components.about_page.values]
                    list[idx].description = e.target.value
                    updateField(['components', 'about_page', 'values'], list)
                  }}
                />
              </div>
            )}
          />

          {/* Team */}
          <ArrayField
            label='Team Members'
            items={data.components.about_page.team}
            onAdd={() =>
              updateField(
                ['components', 'about_page', 'team'],
                [
                  ...data.components.about_page.team,
                  { name: '', role: '', image: '' },
                ]
              )
            }
            onRemove={(i) => {
              const list = [...data.components.about_page.team]
              list.splice(i, 1)
              updateField(['components', 'about_page', 'team'], list)
            }}
            renderItem={(item, idx) => (
              <div className='space-y-2'>
                <Input
                  placeholder='Name'
                  value={item.name}
                  onChange={(e) => {
                    const list = [...data.components.about_page.team]
                    list[idx].name = e.target.value
                    updateField(['components', 'about_page', 'team'], list)
                  }}
                />
                <Input
                  placeholder='Role'
                  value={item.role}
                  onChange={(e) => {
                    const list = [...data.components.about_page.team]
                    list[idx].role = e.target.value
                    updateField(['components', 'about_page', 'team'], list)
                  }}
                />
                <div className='space-y-2'>
                  <ImageInput
                    label='Team Member Image'
                    name={`team-${idx}-image`}
                    value={item.image}
                    onChange={(file) => {
                      handleImageChange(
                        [
                          'components',
                          'about_page',
                          'team',
                          idx.toString(),
                          'image',
                        ],
                        file
                      )
                    }}
                    isFileInput={true}
                  />
                  {isUploading([
                    'components',
                    'about_page',
                    'team',
                    idx.toString(),
                    'image',
                  ]) && (
                    <p className='text-muted-foreground text-sm'>
                      Uploading...
                    </p>
                  )}
                </div>
              </div>
            )}
          />

          {/* Stats */}
          <ArrayField
            label='Stats'
            items={data.components.about_page.stats}
            onAdd={() =>
              updateField(
                ['components', 'about_page', 'stats'],
                [...data.components.about_page.stats, { value: '', label: '' }]
              )
            }
            onRemove={(i) => {
              const list = [...data.components.about_page.stats]
              list.splice(i, 1)
              updateField(['components', 'about_page', 'stats'], list)
            }}
            renderItem={(item, idx) => (
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  placeholder='Value (e.g. 10+)'
                  value={item.value}
                  onChange={(e) => {
                    const list = [...data.components.about_page.stats]
                    list[idx].value = e.target.value
                    updateField(['components', 'about_page', 'stats'], list)
                  }}
                />
                <Input
                  placeholder='Label'
                  value={item.label}
                  onChange={(e) => {
                    const list = [...data.components.about_page.stats]
                    list[idx].label = e.target.value
                    updateField(['components', 'about_page', 'stats'], list)
                  }}
                />
              </div>
            )}
          />
        </div>

        {/* Optional Save Button */}

        <div className='mt-6'>
          <Button onClick={handleSave} disabled={uploadingPaths.size > 0}>
            {uploadingPaths.size > 0
              ? 'Uploading Images...'
              : 'Save About Page'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default VendorTemplateAbout
