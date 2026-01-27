/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-duplicate-imports */
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useEffect, useState } from 'react'
import { type AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubcategories } from '@/store/slices/admin/subcategorySlice'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { Loader2 } from 'lucide-react'
import { Pagination } from '@/components/pagination'

const route = getRouteApi('/_authenticated/subcategory/')

export function SubCategory() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { subcategories, loading, error, pagination } = useSelector(
    (state: any) => state.subcategories
  )
  const totalPages = pagination?.totalPages || 1
  const limit = 10
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(fetchSubcategories({ page, limit }))
  }, [dispatch, page, limit])

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Sub Category List</h2>
            <p className='text-muted-foreground'>
              Manage your sub categories here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        {/* ✅ Handle loading, error, and empty states */}
        {loading ? (
          <div className='flex justify-center items-center py-10'>
            <Loader2 className='w-6 h-6 animate-spin text-muted-foreground' />
            <span className='ml-2 text-muted-foreground'>Loading subcategories...</span>
          </div>
        ) : error ? (
          <div className='text-red-500 text-center py-6'>
            ⚠️ Failed to load subcategories: {error}
          </div>
        ) : !subcategories || subcategories.length === 0 ? (
          <div className='text-center py-6 text-muted-foreground'>
            No subcategories found. Try adding one.
          </div>
        ) : (
          <>
            <UsersTable data={subcategories} search={search} navigate={navigate} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          </>
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
