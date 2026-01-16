import { useCan } from '@/hooks/useCan'
import { ROLES } from '@/components/layout/data/sidebar-data'
import UploadCategoryDialog from './UploadCategoryDialog'

export function UsersPrimaryButtons() {
  const canAdminSee = useCan([ROLES.ADMIN])
  return (
    <div className='flex gap-2'>
      {canAdminSee && (
        <>
          <UploadCategoryDialog />
        </>
      )}
    </div>
  )
}
