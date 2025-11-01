// src/components/form/TemplateForm.tsx
import { useState } from 'react'
import axios from 'axios'
import { BASE_URL, BASE_URL_TEMPLATE } from '@/store/slices/vendor/productSlice'
import { Link2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ArrayField } from './ArrayField'
import { ImageInput } from './ImageInput'

type TemplateData = {
  name: string
  previewImage: string
  components: {
    logo: string
    home_page: any
    about_page: any
    contact_page: any
  }
}

const initialData: TemplateData = {
  name: '',
  previewImage: '',
  components: {
    logo: '',
    home_page: {
      header_text: '',
      header_text_small: '',
      button_header: '',
      description: {
        large_text: '',
        summary: '',
        percent: { percent_in_number: '', percent_text: '' },
        sold: { sold_number: '', sold_text: '' },
      },
    },
    about_page: {
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: '',
      },
      story: {
        heading: '',
        paragraphs: [''],
        image: '',
      },
      values: [{ icon: '', title: '', description: '' }],
      team: [{ name: '', role: '', image: '' }],
      stats: [{ value: '', label: '' }],
    },
    contact_page: {
      hero: {
        backgroundImage: '',
        title: '',
        subtitle: '',
      },
      contactInfo: [{ icon: '', title: '', details: '' }],
      contactForm: {
        heading: '',
        description: '',
        fields: [
          {
            label: 'Full Name',
            name: 'fullName',
            type: 'text',
            placeholder: 'Enter your name',
            required: true,
          },
          {
            label: 'Email Address',
            name: 'email',
            type: 'email',
            placeholder: 'Enter your email',
            required: true,
          },
          {
            label: 'Message',
            name: 'message',
            type: 'textarea',
            placeholder: 'Write your message here',
            required: true,
          },
        ],
        submitButtonText: '',
      },
      visitInfo: {
        heading: '',
        description: '',
        mapImage: '',
        reasonsHeading: '',
        reasonsList: [''],
      },
      faqSection: {
        heading: '',
        subheading: '',
        faqs: [{ question: '', answer: '' }],
      },
    },
  },
}

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
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Trim whitespace in image URLs
    const payload = JSON.parse(JSON.stringify(data))
    const trimImage = (obj: any) => {
      if (typeof obj === 'string' && obj.trim().startsWith('http')) {
        return obj.trim()
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => {
          obj[key] = trimImage(obj[key])
        })
      }
      return obj
    }
    trimImage(payload)

    try {
      const res = await axios.post(`${BASE_URL}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.status == 200) {
        setSubmitStatus('success')
      } else {
        setSubmitStatus('error')
      }
    } catch (err) {
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
              href={`${BASE_URL_TEMPLATE}/?vendor_id=${vendor_id}`}
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
              <Label htmlFor='name'>Template Name</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => updateField(['name'], e.target.value)}
                required
              />
            </div>
            <ImageInput
              label='Preview Image'
              name='previewImage'
              value={data.previewImage}
              onChange={(v) => updateField(['previewImage'], v)}
            />
          </div>

          {/* Logo */}
          <ImageInput
            label='Logo URL'
            name='logo'
            value={data.components.logo}
            onChange={(v) => updateField(['components', 'logo'], v)}
          />

          {/* Home Page */}
          <Separator />
          <h2 className='text-lg font-semibold'>Home Page</h2>
          <div className='space-y-4'>
            <Input
              placeholder='Header Text'
              value={data.components.home_page.header_text}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'header_text'],
                  e.target.value
                )
              }
            />
            <Input
              placeholder='Header Subtitle'
              value={data.components.home_page.header_text_small}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'header_text_small'],
                  e.target.value
                )
              }
            />
            <Input
              placeholder='Button Text'
              value={data.components.home_page.button_header}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'button_header'],
                  e.target.value
                )
              }
            />
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

          {/* About Page */}
          <Separator />
          <h2 className='text-lg font-semibold'>About Page</h2>
          <div className='space-y-4'>
            <ImageInput
              label='Hero Background'
              name='aboutHeroBg'
              value={data.components.about_page.hero.backgroundImage}
              onChange={(v) =>
                updateField(
                  ['components', 'about_page', 'hero', 'backgroundImage'],
                  v
                )
              }
            />
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
                    value={typeof item === 'string' ? item : ''}
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

            <ImageInput
              label='Story Image'
              name='storyImage'
              value={data.components.about_page.story.image}
              onChange={(v) =>
                updateField(['components', 'about_page', 'story', 'image'], v)
              }
            />

            {/* Values */}
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
              renderItem={(item: any, idx) => (
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
              renderItem={(item: any, idx) => (
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
                  <ImageInput
                    label='Image'
                    name={`team-${idx}-img`}
                    value={item.image}
                    onChange={(v) => {
                      const list = [...data.components.about_page.team]
                      list[idx].image = v
                      updateField(['components', 'about_page', 'team'], list)
                    }}
                  />
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
                  [
                    ...data.components.about_page.stats,
                    { value: '', label: '' },
                  ]
                )
              }
              onRemove={(i) => {
                const list = [...data.components.about_page.stats]
                list.splice(i, 1)
                updateField(['components', 'about_page', 'stats'], list)
              }}
              renderItem={(item: any, idx) => (
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

          {/* Contact Page - Simplified for brevity; follow same pattern */}
          <Separator />
          <h2 className='text-lg font-semibold'>Contact Page</h2>
          <p className='text-muted-foreground text-sm'>
            Configure hero, contact info, FAQs, etc. (implementation follows
            same pattern as above)
          </p>

          {/* Submit */}
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

          {/* Optional: JSON Preview */}
          <details className='text-xs'>
            <summary>View Payload</summary>
            <pre className='bg-muted mt-2 max-h-60 overflow-auto rounded p-2'>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
