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

// Base file path for vendor files
const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL_BANNERS


// 🧾 Vendor Type Definition
export type Vendor = {
  id: string
  name: string
  business_type: string
  gst_number: string
  pan_number: string
  alternate_contact_name: string
  alternate_contact_phone: string
  address: string
  street: string
  city: string
  state: string
  pincode: string
  bank_name: string
  bank_account: string
  ifsc_code: string
  branch: string
  upi_id: string
  categories: string
  return_policy: string
  operating_hours: string
  gst_cert: string
  pan_card: string
  email: string
  phone: string
  role: string
  is_email_verified: boolean
  is_profile_completed: boolean
  profile_complete_level: number
  is_active: boolean
  is_verified: boolean
  createdAt: string
  updatedAt: string
}

// 🧱 Table Columns
export const vendorColumns: ColumnDef<Vendor>[] = [
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

  // 🧍 Vendor Name
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vendor Name' />
    ),
    cell: ({ row }) => <LongText className='font-medium'>{row.getValue('name')}</LongText>,
  },

  // 📧 Email
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('email')}</div>,
  },

  // 📱 Phone
  {
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Phone' />,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },

  // 🏢 Business Type
  {
    accessorKey: 'business_type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Business Type' />,
    cell: ({ row }) => <div>{row.getValue('business_type')}</div>,
  },

  // ✅ Active Status
  {
    accessorKey: 'is_active',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt')).toLocaleDateString()
      return <div className='text-muted-foreground'>{date}</div>
    },
  },

  // 👁️ View / ⚙️ Actions
  {
    id: 'actions',
    cell: ({ row }) => {
      const data = row.original
      return (
        <div className='flex items-center gap-2'>
          {/* 👁️ View Details */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' size='icon'>
                <Eye className='h-4 w-4' />
              </Button>
            </DialogTrigger>

            <DialogContent className='max-w-3xl h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='text-xl font-semibold'>
                  {data.name}
                </DialogTitle>
                <DialogDescription>
                  Detailed information about this vendor.
                </DialogDescription>
              </DialogHeader>

              <div className='grid grid-cols-2 gap-4 py-4'>
                <div><p className='font-medium'>Email:</p><p className='text-muted-foreground'>{data.email}</p></div>
                <div><p className='font-medium'>Phone:</p><p className='text-muted-foreground'>{data.phone}</p></div>
                <div><p className='font-medium'>Business Type:</p><p className='text-muted-foreground'>{data.business_type}</p></div>
                <div><p className='font-medium'>GST Number:</p><p className='text-muted-foreground'>{data.gst_number}</p></div>
                <div><p className='font-medium'>PAN Number:</p><p className='text-muted-foreground'>{data.pan_number}</p></div>
                <div><p className='font-medium'>Alternate Contact Name:</p><p className='text-muted-foreground'>{data.alternate_contact_name}</p></div>
                <div><p className='font-medium'>Alternate Contact Phone:</p><p className='text-muted-foreground'>{data.alternate_contact_phone}</p></div>
                <div><p className='font-medium'>Address:</p><p className='text-muted-foreground'>{data.address}</p></div>
                <div><p className='font-medium'>Street:</p><p className='text-muted-foreground'>{data.street}</p></div>
                <div><p className='font-medium'>City:</p><p className='text-muted-foreground'>{data.city}</p></div>
                <div><p className='font-medium'>State:</p><p className='text-muted-foreground'>{data.state}</p></div>
                <div><p className='font-medium'>Pincode:</p><p className='text-muted-foreground'>{data.pincode}</p></div>
                <div><p className='font-medium'>Bank Name:</p><p className='text-muted-foreground'>{data.bank_name}</p></div>
                <div><p className='font-medium'>Account:</p><p className='text-muted-foreground'>{data.bank_account}</p></div>
                <div><p className='font-medium'>IFSC Code:</p><p className='text-muted-foreground'>{data.ifsc_code}</p></div>
                <div><p className='font-medium'>Branch:</p><p className='text-muted-foreground'>{data.branch}</p></div>
                <div><p className='font-medium'>UPI ID:</p><p className='text-muted-foreground'>{data.upi_id}</p></div>
                <div><p className='font-medium'>Categories:</p><p className='text-muted-foreground'>{data.categories}</p></div>
                <div><p className='font-medium'>Return Policy:</p><p className='text-muted-foreground'>{data.return_policy}</p></div>
                <div><p className='font-medium'>Operating Hours:</p><p className='text-muted-foreground'>{data.operating_hours}</p></div>

                <div><p className='font-medium'>Email Verified:</p>
                  <Badge variant='outline' className={cn(data.is_email_verified ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600')}>
                    {data.is_email_verified ? 'Yes' : 'No'}
                  </Badge>
                </div>

                <div><p className='font-medium'>Profile Completed:</p>
                  <Badge variant='outline' className={cn(data.is_profile_completed ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600')}>
                    {data.is_profile_completed ? `${data.profile_complete_level}%` : 'No'}
                  </Badge>
                </div>

                <div><p className='font-medium'>Verified:</p>
                  <Badge variant='outline' className={cn(data.is_verified ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600')}>
                    {data.is_verified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>

                <div><p className='font-medium'>Status:</p>
                  <Badge variant='outline' className={cn(data.is_active ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600')}>
                    {data.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div><p className='font-medium'>Created At:</p>
                  <p className='text-muted-foreground text-sm'>{new Date(data.createdAt).toLocaleString()}</p>
                </div>

                {/* 📄 GST Certificate */}
                <div className='col-span-2'>
                  <p className='font-medium mb-1'>GST Certificate:</p>
                  {data.gst_cert ? (
                    <a
                      href={`${BASE_URL}${data.gst_cert}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      View GST Certificate (PDF)
                    </a>
                  ) : (
                    <p className='text-muted-foreground italic'>Not Uploaded</p>
                  )}
                </div>

                {/* 📄 PAN Card */}
                <div className='col-span-2'>
                  <p className='font-medium mb-1'>PAN Card:</p>
                  {data.pan_card ? (
                   
                    <a
                      href={`${BASE_URL}${data.pan_card}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 underline'
                    >
                      View PAN Card (PDF)
                    </a>
                  ) : (
                    <p className='text-muted-foreground italic'>Not Uploaded</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* ⚙️ Edit/Delete Actions */}
          <DataTableRowActions row={row} />
        </div>
      )
    },
    meta: { className: 'w-10' },
  },
]
