import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Trash2, UserPen, Plus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createSubcategory } from "@/store/slices/admin/subcategorySlice";

export function DataTableRowActions({ row }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [subName, setSubName] = useState("");

  const handleAddSubcategory = async () => {
    if (!subName.trim()) {
      toast.error("Please enter a subcategory name.");
      return;
    }

    try {
      await dispatch(
        createSubcategory({
          name: subName,
          category_id: row.original.id, // assuming `row.original.id` is category_id
        })
      ).unwrap();

      setSubName("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create subcategory:", err);
    }
  };

  return (
    <>
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

          {/* ✅ Add Subcategory with Modal */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Add Sub Category
            <DropdownMenuShortcut>
              <Plus size={16} />
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

      {/* ✅ Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter subcategory name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

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
