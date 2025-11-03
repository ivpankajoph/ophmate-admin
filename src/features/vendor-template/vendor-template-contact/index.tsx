/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrayField } from '../components/form/ArrayField'
import { ImageInput } from '../components/form/ImageInput'
import { initialData, TemplateData } from '../data'

function VendorTemplateContact() {
  const [data, setData] = useState<TemplateData>(initialData)

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
  return (
    <>
      <div className='container mx-auto max-w-4xl py-8'>
        <Card className='p-6'>
          <CardTitle className='flex gap-4'>
            Template Preview{' '}
            <a
              className='w-fit'
              href={`http://localhost:3000/contact`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Link2 className='-mt-1' />
            </a>
          </CardTitle>
          <h2 className='text-lg font-semibold'>Contact Page</h2>

          {/* Hero */}
          <div className='space-y-2'>
            <ImageInput
              label='Contact Hero Background'
              name='contactHeroBg'
              value={data.components.contact_page.hero.backgroundImage}
              onChange={(file) =>
                handleImageChange(
                  ['components', 'contact_page', 'hero', 'backgroundImage'],
                  file
                )
              }
              isFileInput={true}
            />
          </div>
          <Input
            placeholder='Hero Title'
            value={data.components.contact_page.hero.title}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'hero', 'title'],
                e.target.value
              )
            }
          />
          <Input
            placeholder='Hero Subtitle'
            value={data.components.contact_page.hero.subtitle}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'hero', 'subtitle'],
                e.target.value
              )
            }
          />

          {/* Contact Info */}
          <div className='space-y-2'>
            <Label>Contact Information</Label>
            {data.components.contact_page.contactInfo.map((info, idx) => (
              <div key={idx} className='grid grid-cols-1 gap-2 md:grid-cols-3'>
                <Input
                  placeholder='Title'
                  value={info.title}
                  onChange={(e) => {
                    const list = [...data.components.contact_page.contactInfo]
                    list[idx].title = e.target.value
                    updateField(
                      ['components', 'contact_page', 'contactInfo'],
                      list
                    )
                  }}
                />
                <Input
                  placeholder='Details'
                  value={info.details}
                  onChange={(e) => {
                    const list = [...data.components.contact_page.contactInfo]
                    list[idx].details = e.target.value
                    updateField(
                      ['components', 'contact_page', 'contactInfo'],
                      list
                    )
                  }}
                />
                <Input
                  placeholder='Icon (e.g. mail)'
                  value={info.icon}
                  onChange={(e) => {
                    const list = [...data.components.contact_page.contactInfo]
                    list[idx].icon = e.target.value
                    updateField(
                      ['components', 'contact_page', 'contactInfo'],
                      list
                    )
                  }}
                />
              </div>
            ))}
          </div>

          {/* Contact Form Submit Button */}
          <div className='space-y-2'>
            <Label>Submit Button Text</Label>
            <Input
              placeholder='e.g. Send Message'
              value={data.components.contact_page.contactForm.submitButtonText}
              onChange={(e) =>
                updateField(
                  [
                    'components',
                    'contact_page',
                    'contactForm',
                    'submitButtonText',
                  ],
                  e.target.value
                )
              }
            />
          </div>

          {/* Visit Info */}
          <div className='space-y-2'>
            <Label>Visit Info Heading</Label>
            <Input
              value={data.components.contact_page.visitInfo.heading}
              onChange={(e) =>
                updateField(
                  ['components', 'contact_page', 'visitInfo', 'heading'],
                  e.target.value
                )
              }
            />
            <Label>Visit Info Description</Label>
            <Textarea
              value={data.components.contact_page.visitInfo.description}
              onChange={(e) =>
                updateField(
                  ['components', 'contact_page', 'visitInfo', 'description'],
                  e.target.value
                )
              }
            />
            <ImageInput
              label='Map Image'
              name='mapImage'
              value={data.components.contact_page.visitInfo.mapImage}
              onChange={(file) =>
                handleImageChange(
                  ['components', 'contact_page', 'visitInfo', 'mapImage'],
                  file
                )
              }
              isFileInput={true}
            />
            <Label>Reasons Heading</Label>
            <Input
              value={data.components.contact_page.visitInfo.reasonsHeading}
              onChange={(e) =>
                updateField(
                  ['components', 'contact_page', 'visitInfo', 'reasonsHeading'],
                  e.target.value
                )
              }
            />
            <Label>Reasons List</Label>
            <ArrayField
              label='Reasons'
              items={data.components.contact_page.visitInfo.reasonsList}
              onAdd={() =>
                updateField(
                  ['components', 'contact_page', 'visitInfo', 'reasonsList'],
                  [...data.components.contact_page.visitInfo.reasonsList, '']
                )
              }
              onRemove={(i) => {
                const list = [
                  ...data.components.contact_page.visitInfo.reasonsList,
                ]
                list.splice(i, 1)
                updateField(
                  ['components', 'contact_page', 'visitInfo', 'reasonsList'],
                  list
                )
              }}
              renderItem={(item, idx) => (
                <Input
                  value={item}
                  onChange={(e) => {
                    const list = [
                      ...data.components.contact_page.visitInfo.reasonsList,
                    ]
                    list[idx] = e.target.value
                    updateField(
                      [
                        'components',
                        'contact_page',
                        'visitInfo',
                        'reasonsList',
                      ],
                      list
                    )
                  }}
                />
              )}
            />
          </div>
        </Card>
      </div>
    </>
  )
}

export default VendorTemplateContact
