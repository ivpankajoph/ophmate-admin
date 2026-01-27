/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { CategoryTree } from './components/category-tree'
import { useEffect, useState } from 'react'
import { AppDispatch } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCategories } from '@/store/slices/admin/categorySlice'
import { Pagination } from '@/components/pagination'

export function Category() {
  const dispatch = useDispatch<AppDispatch>()

  const { categories, loading, error, pagination } = useSelector(
    (state: any) => state.categories
  )
  const totalPages = pagination?.totalPages || 1
  const limit = 10
  const [page, setPage] = useState(1)
  const mainCategoryTotal = categories?.length
    ? new Set(
        categories.map(
          (cat: any) => cat?.mainCategory?._id || cat?.mainCategory?.name || 'unassigned'
        )
      ).size
    : 0

  useEffect(() => {
    dispatch(getAllCategories({ page, limit }))
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
            <h2 className='text-2xl font-bold tracking-tight'>Category List</h2>
            <p className='text-muted-foreground'>
              Manage your categories here.
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Total main categories: {mainCategoryTotal}
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        {/* ✅ Handle loading, error, and empty states */}
        {loading ? (
          <p className="text-center py-10 text-muted-foreground">Loading categories...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Error loading categories.</p>
        ) : !categories || categories.length === 0 ? (
          <p className="text-center py-10 text-muted-foreground">No categories found.</p>
        ) : (
          <>
            <CategoryTree categories={categories} />
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
