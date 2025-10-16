import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

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
  parent_id: string | null
  level: number | null
  is_active: boolean
  createdAt: string
  updatedAt: string
  subcategories: {
    id: string
    name: string
    slug: string
    is_active: boolean
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

  // 🏷️ Category Name
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category Name' />
    ),
    cell: ({ row }) => (
      <LongText className='font-medium'>{row.getValue('name')}</LongText>
    ),
  },

  // 🧾 Description
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-56 text-muted-foreground'>
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
    cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('slug')}</div>,
  },

  // 🧭 Subcategories
  {
    id: 'subcategories',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subcategories' />
    ),
    cell: ({ row }) => {
      const subs = row.original.subcategories
      if (!subs?.length)
        return <span className='text-muted-foreground text-sm italic'>None</span>

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
            isActive ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'
          )}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    enableSorting: false,
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
    enableSorting: true,
  },

  // ⚙️ Actions (Edit/Delete)
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: { className: 'w-10' },
  },
]
