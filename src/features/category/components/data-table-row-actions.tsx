'use client'

import { useState } from 'react'
import axios from 'axios'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { AppDispatch } from '@/store'
import { createSubcategory } from '@/store/slices/admin/subcategorySlice'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { Trash2, UserPen, Plus, Eye } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Define types for the API response
type Specification = {
  _id: string
  key: string
}

type SpecificationSet = {
  _id: string
  category_id: string
  title: string
  specs: Specification[]
  createdAt: string
  updatedAt: string
  __v: number
}

type SpecificationsResponse = {
  data: SpecificationSet[]
}

export function DataTableRowActions({ row }: any) {
  const dispatch = useDispatch<AppDispatch>()

  // Subcategory modal state
  const [openSubcategory, setOpenSubcategory] = useState(false)
  const [subName, setSubName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  // Specifications modal state
  const [openSpec, setOpenSpec] = useState(false)
  const [specTitle, setSpecTitle] = useState('')
  const [specKeys, setSpecKeys] = useState<string>('')

  // Show specifications modal state
  const [openShowSpec, setOpenShowSpec] = useState(false)
  const [specifications, setSpecifications] = useState<SpecificationSet[]>([])
  const [loading, setLoading] = useState(false)

  const handleAddSubcategory = async () => {
    if (!subName.trim() || !description.trim()) {
      toast.error('Please fill all required fields.')
      return
    }

    if (!image) {
      toast.error('Please upload an image.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', subName)
      formData.append('description', description)
      formData.append('category_name', row.original.name) // ✅ from category row
      formData.append('image', image)

      await dispatch(createSubcategory(formData)).unwrap()

      toast.success('Subcategory created successfully!')
      setSubName('')
      setDescription('')
      setImage(null)
      setOpenSubcategory(false)
    } catch (err) {
      console.error('Failed to create subcategory:', err)
      toast.error('Failed to create subcategory.')
    }
  }

  const handleAddSpecifications = async () => {
    if (!specTitle.trim() || !specKeys.trim()) {
      toast.error('Please fill all required fields.')
      return
    }

    try {
      // Parse the specKeys string into an array
      const keysArray = specKeys
        .split('\n')
        .map((key) => key.trim())
        .filter((key) => key.length > 0)

      // Transform into the required format
      const specs: any = keysArray.map((key) => ({ key }))

      const response = await axios.post(`${BASE_URL}/specifications`, {
        category_id: row.original.id,
        title: specTitle,
        specs: specs,
      })

      // Axios automatically throws for non-2xx status codes,
      // so you don't need response.ok
      const result = response.data

      console.log(result)

      toast.success('Specifications created successfully!')
      setSpecTitle('')
      setSpecKeys('')
      setOpenSpec(false)
    } catch (err) {
      console.error('Failed to create specifications:', err)
      toast.error('Failed to create specifications.')
    }
  }

  const handleShowSpecifications = async () => {
    setLoading(true)
    try {
      const response = await axios.get<SpecificationsResponse>(
        `${BASE_URL}/specifications/category/${row.original.id}`
      )

      setSpecifications(response.data.data)

      setOpenShowSpec(true)
    } catch (err) {
      console.error('Failed to fetch specifications:', err)
      toast.error('Failed to fetch specifications.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Dropdown menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-[180px]'>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenSubcategory(true)}>
            Add Sub Category
            <DropdownMenuShortcut>
              <Plus size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpenSpec(true)}>
            Create Specification
            <DropdownMenuShortcut>
              <Plus size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleShowSpecifications}>
            Show Specifications
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className='text-red-500'>
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for Add Subcategory */}
      <Dialog open={openSubcategory} onOpenChange={setOpenSubcategory}>
        <DialogContent className='sm:max-w-[450px]'>
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory under{' '}
              <span className='text-primary font-medium'>
                {row.original.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Name */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='subName' className='text-right'>
                Name
              </Label>
              <Input
                id='subName'
                placeholder='Enter subcategory name'
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className='col-span-3'
              />
            </div>

            {/* Description */}
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='description' className='pt-1 text-right'>
                Description
              </Label>
              <Textarea
                id='description'
                placeholder='Enter subcategory description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='col-span-3'
              />
            </div>

            {/* Image Upload */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='image' className='text-right'>
                Image
              </Label>
              <Input
                id='image'
                type='file'
                accept='image/*'
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className='col-span-3'
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpenSubcategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Add Specifications */}
      <Dialog open={openSpec} onOpenChange={setOpenSpec}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Create Specifications</DialogTitle>
            <DialogDescription>
              Add specifications for category{' '}
              <span className='text-primary font-medium'>
                {row.original.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Title */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='specTitle' className='text-right'>
                Title
              </Label>
              <Input
                id='specTitle'
                placeholder='Enter specification title'
                value={specTitle}
                onChange={(e) => setSpecTitle(e.target.value)}
                className='col-span-3'
              />
            </div>

            {/* Specs Keys */}
            <div className='grid grid-cols-4 items-start gap-4'>
              <Label htmlFor='specKeys' className='pt-1 text-right'>
                Specifications
              </Label>
              <Textarea
                id='specKeys'
                placeholder='Enter each specification key on a new line&#10;Example:&#10;Brand&#10;Material&#10;Color'
                value={specKeys}
                onChange={(e) => setSpecKeys(e.target.value)}
                className='col-span-3 h-40'
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpenSpec(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSpecifications}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for Show Specifications */}
      <Dialog open={openShowSpec} onOpenChange={setOpenShowSpec}>
        <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Specifications for {row.original.name}</DialogTitle>
            <DialogDescription>
              All specification sets for this category
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className='flex h-20 items-center justify-center'>
              <p>Loading specifications...</p>
            </div>
          ) : specifications.length === 0 ? (
            <div className='py-4 text-center'>
              <p>No specifications found for this category.</p>
            </div>
          ) : (
            <div className='space-y-6'>
              {specifications.map((specSet) => (
                <div key={specSet._id} className='rounded-lg border p-4'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    {specSet.title}
                  </h3>
                  <p className='mb-3 text-sm text-gray-500'>
                    Created: {new Date(specSet.createdAt).toLocaleDateString()}
                  </p>
                  <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                    {specSet.specs.map((spec) => (
                      <div
                        key={spec._id}
                        className='rounded bg-gray-100 px-3 py-1 text-sm'
                      >
                        {spec.key}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='flex justify-end'>
            <Button onClick={() => setOpenShowSpec(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
