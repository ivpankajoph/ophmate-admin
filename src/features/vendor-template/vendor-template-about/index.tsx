/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, useMemo, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND } from '@/config'
import { TemplatePageLayout } from '../components/TemplatePageLayout'
import { TemplatePreviewPanel } from '../components/TemplatePreviewPanel'
import { TemplateSectionOrder } from '../components/TemplateSectionOrder'
import { ArrayField } from '../components/form/ArrayField'
import { ImageInput } from '../components/form/ImageInput'
import { initialData, TemplateData } from '../data'

function VendorTemplateAbout() {
  const [data, setData] = useState<TemplateData>(initialData)
  const [uploadingPaths, setUploadingPaths] = useState<Set<string>>(new Set())
  const [sectionOrder, setSectionOrder] = useState([
    'hero',
    'story',
    'values',
    'team',
    'stats',
  ])

  const vendor_id = useSelector((state: any) => state.auth.user.id)

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
      await axios.put(`${BASE_URL}/v1/templates/about`, {
        vendor_id,
        components: data.components.about_page,
        section_order: sectionOrder,
      })
      alert('About page saved successfully!')
    } catch {
      alert('Failed to save about page.')
    }
  }

  const previewUrl = vendor_id ? `/template/${vendor_id}/about` : undefined
  const fullPreviewUrl = vendor_id
    ? `${VITE_PUBLIC_API_URL_TEMPLATE_FRONTEND}/template/${vendor_id}`
    : undefined

  const sections = useMemo(
    () => [
      {
        id: 'hero',
        title: 'Hero Block',
        description: 'Hero background, title, and subtitle',
      },
      {
        id: 'story',
        title: 'Story + Media',
        description: 'Narrative paragraphs and featured image',
      },
      {
        id: 'values',
        title: 'Core Values',
        description: 'Iconic value statements',
      },
      {
        id: 'team',
        title: 'Team Spotlight',
        description: 'Team member cards',
      },
      {
        id: 'stats',
        title: 'Highlight Stats',
        description: 'Numbers that build trust',
      },
    ],
    []
  )

  const sectionBlocks: Record<string, JSX.Element> = {
    hero: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <div className='space-y-4'>
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
            {uploadingPaths.has(
              ['components', 'about_page', 'hero', 'backgroundImage'].join('.')
            ) && <p className='text-sm text-slate-500'>Uploading...</p>}
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
        </div>
      </div>
    ),
    story: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <div className='space-y-4'>
          <Input
            value={data.components.about_page.story.heading}
            onChange={(e) =>
              updateField(
                ['components', 'about_page', 'story', 'heading'],
                e.target.value
              )
            }
            placeholder='Story Heading'
          />
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
                    const list = [...data.components.about_page.story.paragraphs]
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
            {uploadingPaths.has(
              ['components', 'about_page', 'story', 'image'].join('.')
            ) && <p className='text-sm text-slate-500'>Uploading...</p>}
          </div>
        </div>
      </div>
    ),
    values: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
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
      </div>
    ),
    team: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
        <ArrayField
          label='Team Members'
          items={data.components.about_page.team}
          onAdd={() =>
            updateField(
              ['components', 'about_page', 'team'],
              [...data.components.about_page.team, { name: '', role: '', image: '' }]
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
                      ['components', 'about_page', 'team', idx.toString(), 'image'],
                      file
                    )
                  }}
                  isFileInput={true}
                />
                {uploadingPaths.has(
                  ['components', 'about_page', 'team', idx.toString(), 'image'].join('.')
                ) && <p className='text-sm text-slate-500'>Uploading...</p>}
              </div>
            </div>
          )}
        />
      </div>
    ),
    stats: (
      <div className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm'>
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
    ),
  }

  return (
    <TemplatePageLayout
      title='About Page Builder'
      description='Tell your story, highlight your values, and introduce the team. Reorder sections to control how the narrative flows.'
      activeKey='about'
      actions={
        <Button
          onClick={handleSave}
          disabled={uploadingPaths.size > 0}
          className='rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800'
        >
          {uploadingPaths.size > 0 ? 'Uploading...' : 'Save About Page'}
        </Button>
      }
      preview={
        <TemplatePreviewPanel
          title='Live About Preview'
          subtitle='Sync to refresh the right-side preview'
          src={previewUrl}
          fullPreviewUrl={fullPreviewUrl}
          onSync={handleSave}
          syncDisabled={uploadingPaths.size > 0}
          vendorId={vendor_id}
          page='about'
          previewData={data}
          sectionOrder={sectionOrder}
        />
      }
    >
      <TemplateSectionOrder
        title='About Page Sections'
        items={sections}
        order={sectionOrder}
        setOrder={setSectionOrder}
      />

      {sectionOrder.map((sectionId) => (
        <div key={sectionId}>{sectionBlocks[sectionId]}</div>
      ))}
    </TemplatePageLayout>
  )
}

export default VendorTemplateAbout
