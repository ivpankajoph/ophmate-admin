'use client'

import { useState } from 'react'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Trash2, UserPen, Plus, Eye } from 'lucide-react'
import AddSubcategoryModal from './AddSubcategoryModal'
import AddSpecificationsModal from './AddSpecificationsModal'
import ShowSpecificationsModal from './ShowSpecificationsModal'
import EditCategoryModal from './EditCategoryModal'

export function DataTableRowActions({ row }: any) {
  const dispatch = useDispatch<AppDispatch>()

  // Modal states
  const [openSubcategory, setOpenSubcategory] = useState(false)
  const [openSpec, setOpenSpec] = useState(false)
  const [openShowSpec, setOpenShowSpec] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

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
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

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

          <DropdownMenuItem onClick={() => setOpenShowSpec(true)}>
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

      {/* Edit Category Modal */}
      <EditCategoryModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        category={row.original}
        dispatch={dispatch}
      />

      {/* Add Subcategory Modal */}
      <AddSubcategoryModal
        open={openSubcategory}
        onOpenChange={setOpenSubcategory}
        category={row.original}
        dispatch={dispatch}
      />

      {/* Add Specifications Modal */}
      <AddSpecificationsModal
        open={openSpec}
        onOpenChange={setOpenSpec}
        category={row.original}
      />

      {/* Show Specifications Modal */}
      <ShowSpecificationsModal
        open={openShowSpec}
        onOpenChange={setOpenShowSpec}
        categoryId={row.original.id}
      />
    </>
  )
}