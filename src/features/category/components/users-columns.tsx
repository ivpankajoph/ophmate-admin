'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

// Fallback Image component for environments without next/image
const Image = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string
  alt?: string
  width?: number
  height?: number
  className?: string
}) => {
  return (
    <img
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      className={className}
    />
  )
}

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL_BANNERS

// 🧩 Type definition for Category
export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  display_order: number | null
  parent_id?: string | null
  level?: number | null
  is_active: boolean
  createdAt: string
  updatedAt: string
  subcategories: {
    id: string
    name: string
    slug: string
    description?: string
    image_url?: string
    is_active?: boolean
  }[]
}

// 🧱 Table column definitions
export const categoryColumns: ColumnDef<Category>[] = [
  // ✅ Checkbox select
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-10' },
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category Name' />
    ),
    cell: ({ row }) => (
      <LongText className='font-medium'>{row.getValue('name')}</LongText>
    ),
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='text-muted-foreground max-w-56'>
        {row.getValue('description') || '-'}
      </LongText>
    ),
  },

  // 🧩 Slug
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground'>{row.getValue('slug')}</div>
    ),
  },


  {
    id: 'subcategories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subcategories' />
    ),
    cell: ({ row }) => {
      const subs = row.original.subcategories
      if (!subs?.length)
        return (
          <span className='text-muted-foreground text-sm italic'>None</span>
        )

      return (
        <div className='flex flex-wrap gap-1'>
          {subs.map((sub) => (
            <Badge key={sub.id} variant='secondary' className='capitalize'>
              {sub.name}
            </Badge>
          ))}
        </div>
      )
    },
    enableSorting: false,
  },

  // 🟢 Active Status
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('is_active')
      return (
        <Badge
          variant='outline'
          className={cn(
            'capitalize',
            isActive
              ? 'border-green-400 text-green-600'
              : 'border-red-400 text-red-600'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },

  // 📅 Created At
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt')).toLocaleDateString()
      return <div className='text-muted-foreground'>{date}</div>
    },
  },

  // 👁️ Expand Button + ⚙️ Actions
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {/* 👁️ View Details Popup */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <Eye className='h-4 w-4' />
            </Button>
          </DialogTrigger>

          <DialogContent className='h-full max-w-2xl overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className='text-xl font-semibold'>
                {row.original.name}
              </DialogTitle>
              <DialogDescription>
                Detailed information about this category.
              </DialogDescription>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-4 py-4'>
              <div>
                <p className='font-medium'>Slug:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.slug}
                </p>
              </div>

              <div>
                <p className='font-medium'>Description:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.description || '-'}
                </p>
              </div>

              <div>
                <p className='font-medium'>Meta Title:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.meta_title || '-'}
                </p>
              </div>

              <div>
                <p className='font-medium'>Meta Description:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.meta_description || '-'}
                </p>
              </div>

              <div>
                <p className='font-medium'>Meta Keywords:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.meta_keywords || '-'}
                </p>
              </div>

              <div>
                <p className='font-medium'>Display Order:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.display_order ?? '-'}
                </p>
              </div>

              <div>
                <p className='font-medium'>Status:</p>
                <Badge
                  variant='outline'
                  className={cn(
                    row.original.is_active
                      ? 'border-green-400 text-green-600'
                      : 'border-red-400 text-red-600'
                  )}
                >
                  {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div>
                <p className='font-medium'>Created At:</p>
                <p className='text-muted-foreground text-sm'>
                  {new Date(row.original.createdAt).toLocaleString()}
                </p>
              </div>

              <div className='col-span-2'>
                <p className='font-medium'>Image:</p>
                {row.original.image_url ? (
                  <div className='mt-2'>
                    <Image
                      src={`${BASE_URL}${row.original.image_url}`}
                      alt={row.original.name}
                      width={200}
                      height={200}
                      className='rounded-md border'
                    />
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm'>No image</p>
                )}
              </div>

              <div className='col-span-2'>
                <p className='mb-1 font-medium'>Subcategories:</p>
                {row.original.subcategories?.length ? (
                  <div className='flex flex-wrap gap-1'>
                    {row.original.subcategories.map((sub) => (
                      <Badge key={sub.id} variant='secondary'>
                        {sub.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>None</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ⚙️ Edit/Delete actions */}
        <DataTableRowActions row={row} />
      </div>
    ),
    meta: { className: 'w-10' },
  },
]
