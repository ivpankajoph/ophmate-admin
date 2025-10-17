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
import { useEffect } from 'react'
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { fetchSubcategories } from '@/store/slices/admin/subcategorySlice'
import { UsersPrimaryButtons } from './components/users-primary-buttons'


const route = getRouteApi('/_authenticated/subcategory/')

export function SubCategory() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const dispatch =useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchSubcategories())
  }, 
  [dispatch])

  const users = useSelector((state: any) => state.subcategories.subcategories)
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
        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
