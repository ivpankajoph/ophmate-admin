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

function VendorTemplateAbout() {
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
    <div className='container mx-auto max-w-4xl py-8'>
      <Card className='p-6'>
        <CardTitle className='flex gap-4'>
          Template Preview{' '}
          <a
            className='w-fit'
            href={`http://localhost:3000/about`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Link2 className='-mt-1' />
          </a>
        </CardTitle>
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
      </Card>
    </div>
  )
}

export default VendorTemplateAbout
