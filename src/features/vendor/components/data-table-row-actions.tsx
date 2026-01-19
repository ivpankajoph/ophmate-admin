/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { VITE_PUBLIC_API_URL } from "@/config";

const API_BASE_URL = VITE_PUBLIC_API_URL;



export function DataTableRowActions({ row }: any) {
  const token = useSelector((state:any)=>state?.auth?.token)
  const vendor = row.original;

  // ✅ Verify Vendor Function
  const handleVerify = async () => {
    Swal.fire({
      title: "Verify Vendor?",
      text: `Are you sure you want to verify ${vendor.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Verify",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a", // green
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/vendors/verify/${vendor._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            toast.success(data.message || "Vendor verified successfully!");
            Swal.fire("Verified!", `${vendor.name} has been verified.`, "success");
          } else {
            throw new Error(data.message || "Failed to verify vendor.");
          }
        } catch (error: any) {
          Swal.fire("Error", error.message || "Something went wrong.", "error");
        }
      }
    });
  };

  // ❌ Reject Vendor Function
  const handleReject = async () => {
    Swal.fire({
      title: "Reject Vendor?",
      text: `Are you sure you want to reject ${vendor.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626", // red
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/vendors/reject/${vendor._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            toast.success(data.message || "Vendor rejected successfully!");
            Swal.fire("Rejected!", `${vendor.name} has been rejected.`, "success");
          } else {
            throw new Error(data.message || "Failed to reject vendor.");
          }
        } catch (error: any) {
          Swal.fire("Error", error.message || "Something went wrong.", "error");
        }
      }
    });
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
          {/* ✅ Verify Vendor */}
          <DropdownMenuItem onClick={handleVerify}>
            Verify Vendor
            <DropdownMenuShortcut>
              <CheckCircle size={16} className="text-green-600" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {/* ❌ Reject Vendor */}
          <DropdownMenuItem onClick={handleReject} className="text-red-500">
            Reject Vendor
            <DropdownMenuShortcut>
              <XCircle size={16} className="text-red-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 🗑️ Delete (Optional) */}
          <DropdownMenuItem className="text-red-500">
            Delete
            <DropdownMenuShortcut>
              <Trash2 size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
