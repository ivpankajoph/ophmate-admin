'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import Swal from 'sweetalert2'
import { createCategory } from '@/store/slices/admin/categorySlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
  description: z.string().min(1, 'Description is required.'),
})

type CategoryForm = z.infer<typeof formSchema>

type CategoryDialogProps = {
  currentRow?: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDialog({ currentRow, open, onOpenChange }: CategoryDialogProps) {
  const isEdit = !!currentRow
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { name: currentRow.name, description: currentRow.description }
      : { name: '', description: '' },
  })

  const onSubmit = async (values: CategoryForm) => {
    onOpenChange(false)
    try {
      Swal.fire({
        title: 'Please wait...',
        text: 'Saving category...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      const res = await dispatch(createCategory(values))

      if (res.meta.requestStatus === 'fulfilled') {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category created successfully.',
          timer: 2000,
          showConfirmButton: false,
        })
        form.reset()
        onOpenChange(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: (res.payload as string) || 'Unable to create category.',
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while creating category.',
      })
    }
  }

  const handleDialogClose = () => {
    onOpenChange(false)
    // if (!state) {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'Your unsaved changes will be lost.',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, close it!',
    //     cancelButtonText: 'Cancel',
    //     confirmButtonColor: '#d33',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       form.reset()
    //       onOpenChange(false)
    //     }
    //   })
    // } else {
    //   onOpenChange(true)
    // }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the category details.' : 'Create a new category.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-1 pe-3">
          <Form {...form}>
            <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-0.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Devices and gadgets" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="submit" form="category-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
