'use client'

import { useState } from 'react'
import { store } from '@/store'
import { Plus } from 'lucide-react'
import { Provider } from 'react-redux'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import BannerList from './components/BannerList'
import BannerUploadForm from './components/BannerUploadForm'

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Provider store={store}>
        <main className='min-h-screen bg-gray-50 p-6 dark:bg-gray-950'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <h1 className='text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-100'>
                Banner Management
              </h1>
              <Button
                variant='default'
                onClick={() => setShowForm(!showForm)}
                className='h-10 rounded-xl bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200'
              >
                <Plus className='mr-2 h-4 w-4' />
                {showForm ? 'View Banners' : 'Upload Banner'}
              </Button>
            </div>

            {showForm ? (
              <div className='mb-12'>
                <BannerUploadForm />
              </div>
            ) : null}

            <BannerList />
          </div>
        </main>
      </Provider>
    </>
  )
}
