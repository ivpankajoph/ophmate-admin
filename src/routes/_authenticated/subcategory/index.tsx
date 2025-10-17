import { SubCategory } from '@/features/subcategory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/subcategory/')({
  component: SubCategory,
})

