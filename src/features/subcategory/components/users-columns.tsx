'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
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
}) => (
  <img
    src={src}
    alt={alt ?? ''}
    width={width}
    height={height}
    className={className}
  />
)


// 🧩 Type definition for Subcategory
export type Subcategory = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  category_id: any
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    slug: string
    description: string | null
    image_url: string | null
    meta_title: string | null
    meta_description: string | null
    meta_keywords: string | null
    display_order: number | null
    is_active: boolean
    createdAt: string
    updatedAt: string
  }
}

// 🧱 Table column definitions
export const subcategoryColumns: ColumnDef<Subcategory>[] = [
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
      <DataTableColumnHeader column={column} title='Subcategory' />
    ),
    cell: ({ row }) => (
      <LongText className='font-medium'>
        {row.getValue('name') || 'N/A'}
      </LongText>
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
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.category_id?.name}</div>
    ),
  },

  // {
  //   accessorKey: 'is_active',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const isActive = row.original.category?.is_active
  //     return (
  //       <Badge
  //         variant='outline'
  //         className={cn(
  //           'capitalize',
  //           isActive
  //             ? 'border-green-400 text-green-600'
  //             : 'border-red-400 text-red-600'
  //         )}
  //       >
  //         {isActive ? 'Active' : 'Inactive'}
  //       </Badge>
  //     )
  //   },
  // },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => (
      <div className='text-muted-foreground'>
        {new Date(row.getValue('createdAt')).toLocaleDateString()}
      </div>
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
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
                Detailed information about this subcategory.
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
                <p className='font-medium'>Category:</p>
                <p className='text-muted-foreground text-sm'>
                  {row.original.category_id?.name}
                </p>
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
                      src={row.original.image_url}
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
            </div>
          </DialogContent>
        </Dialog>

        <DataTableRowActions row={row} />
      </div>
    ),
    meta: { className: 'w-10' },
  },
]
