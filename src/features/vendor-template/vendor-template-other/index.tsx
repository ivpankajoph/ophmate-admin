/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrayField } from '../components/form/ArrayField'
import { initialData, TemplateData } from '../data'
import { Card } from '@/components/ui/card'

function VendorTemplateOther() {
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

  const socialPlatforms: { key: keyof TemplateData['components']['contact_page']['socialMedia']; label: string }[] = [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'whatsapp', label: 'WhatsApp Number or Link' },
    { key: 'twitter', label: 'Twitter/X URL' },
  ]

  return (
    <div className='container mx-auto max-w-4xl py-8'>
        <Card className='p-6'>
      <div className='space-y-6'>
        {/* === FAQ Section === */}
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
                    const list = [...data.components.contact_page.faqSection.faqs]
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
                    const list = [...data.components.contact_page.faqSection.faqs]
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

        {/* === Social Media Section === */}
        <div className='space-y-4 pt-6 border-t'>
          <h2 className='text-lg font-semibold'>Social Media Links</h2>
          {socialPlatforms.map((platform) => (
            <div key={platform.key} className='space-y-1'>
              <Label htmlFor={`social-${platform.key}`}>{platform.label}</Label>
              <Input
                id={`social-${platform.key}`}
                value={data.components.contact_page.socialMedia?.[platform.key] || ''}
                onChange={(e) =>
                  updateField(
                    ['components', 'contact_page', 'socialMedia', platform.key],
                    e.target.value
                  )
                }
                placeholder={`https://...`}
              />
            </div>
          ))}
        </div>
      </div>
      </Card>
    </div>
  )
}

export default VendorTemplateOther