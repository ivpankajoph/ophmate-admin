import BannersPage from '@/features/banners'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/banners/')({
  component: BannersPage,
})


