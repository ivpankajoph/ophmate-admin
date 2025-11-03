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
import { ArrayField } from './ArrayField'
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
              href={`${BASE_URL}/template-preview?vendor_id=${vendor_id}`}
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
            <div className='space-y-2'>
              <ImageInput
                label='Preview Image'
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
              label='Logo'
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
              placeholder='Header Text (Small)'
              value={data.components.home_page.header_text_small}
              onChange={(e) =>
                updateField(
                  ['components', 'home_page', 'header_text_small'],
                  e.target.value
                )
              }
            />
            <Input
              placeholder='Button Header'
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
            </div>

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

          {/* Contact Page */}
          <Separator />
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

          {/* FAQ Section */}
          <div className='space-y-2'>
            <Label>FAQ Heading</Label>
            <Input
              value={data.components.contact_page.faqSection.heading}
              onChange={(e) =>
                updateField(
                  ['components', 'contact_page', 'faqSection', 'heading'],
                  e.target.value
                )
              }
            />
            <Label>FAQ Subheading</Label>
            <Input
              value={data.components.contact_page.faqSection.subheading}
              onChange={(e) =>
                updateField(
                  ['components', 'contact_page', 'faqSection', 'subheading'],
                  e.target.value
                )
              }
            />
            <ArrayField
              label='FAQs'
              items={data.components.contact_page.faqSection.faqs}
              onAdd={() =>
                updateField(
                  ['components', 'contact_page', 'faqSection', 'faqs'],
                  [
                    ...data.components.contact_page.faqSection.faqs,
                    { question: '', answer: '' },
                  ]
                )
              }
              onRemove={(i) => {
                const list = [...data.components.contact_page.faqSection.faqs]
                list.splice(i, 1)
                updateField(
                  ['components', 'contact_page', 'faqSection', 'faqs'],
                  list
                )
              }}
              renderItem={(item, idx) => (
                <div className='space-y-2'>
                  <Input
                    placeholder='Question'
                    value={item.question}
                    onChange={(e) => {
                      const list = [
                        ...data.components.contact_page.faqSection.faqs,
                      ]
                      list[idx].question = e.target.value
                      updateField(
                        ['components', 'contact_page', 'faqSection', 'faqs'],
                        list
                      )
                    }}
                  />
                  <Textarea
                    placeholder='Answer'
                    value={item.answer}
                    onChange={(e) => {
                      const list = [
                        ...data.components.contact_page.faqSection.faqs,
                      ]
                      list[idx].answer = e.target.value
                      updateField(
                        ['components', 'contact_page', 'faqSection', 'faqs'],
                        list
                      )
                    }}
                  />
                </div>
              )}
            />
          </div>

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
