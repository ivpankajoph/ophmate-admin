/* eslint-disable @typescript-eslint/consistent-type-imports */
"use client";

import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Trash2, UserPen, } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createSubcategory } from "@/store/slices/admin/subcategorySlice";

export function DataTableRowActions({ row }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleAddSubcategory = async () => {
    if (!subName.trim() || !description.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", subName);
      formData.append("description", description);
      formData.append("category_name", row.original.name); // ✅ from category row
      formData.append("image", image);

      await dispatch(createSubcategory(formData)).unwrap();

      toast.success("Subcategory created successfully!");
      setSubName("");
      setDescription("");
      setImage(null);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create subcategory:", err);
      toast.error("Failed to create subcategory.");
    }
  };

  return (
    <>
      {/* Dropdown menu */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>


          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-500">
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for Add Subcategory */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory under{" "}
              <span className="font-medium text-primary">
                {row.original.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subName" className="text-right">
                Name
              </Label>
              <Input
                id="subName"
                placeholder="Enter subcategory name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-1">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter subcategory description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Image Upload */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
