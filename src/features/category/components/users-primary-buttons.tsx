import {  UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUsers } from './users-provider'
import UploadCategoryDialog from './UploadCategoryDialog'

export function UsersPrimaryButtons() {
  const { setOpen } = useUsers()
  return (
    <div className='flex gap-2'>
       <UploadCategoryDialog />
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Category</span> <UserPlus size={18} />
      </Button>
    </div>
  )
}
