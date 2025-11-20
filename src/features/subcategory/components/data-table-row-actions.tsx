/* eslint-disable @typescript-eslint/consistent-type-imports */
'use client'

import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Trash2, UserPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import EditCategoryModal from './EditCategoryModal'

/* eslint-disable @typescript-eslint/consistent-type-imports */

export function DataTableRowActions({ row }: any) {
  const dispatch = useDispatch<AppDispatch>()
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
    </>
  )
}