"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { createBanner } from "@/store/slices/admin/bannerSlice";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function BannerUploadForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: any) => state.banners);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      Swal.fire({
        icon: "warning",
        title: "No Image Selected",
        text: "Please select an image before uploading.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      await dispatch(createBanner({ title, description, image }) as any).unwrap();

      Swal.fire({
        icon: "success",
        title: "Banner Created 🎉",
        text: "Your banner has been uploaded successfully!",
        confirmButtonColor: "#16a34a",
      });

      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed 😢",
        text: err?.message || "Something went wrong. Try again!",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleReplaceImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-md shadow-xl border border-gray-200 backdrop-blur-xl bg-white/80 rounded-2xl">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Banner
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Add promotional banners with image preview
          </p>
        </CardHeader>

        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Image Upload</label>
              {!preview ? (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 cursor-pointer"
                />
              ) : (
                <div className="relative mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-md border w-full h-48 object-cover shadow-sm"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleReplaceImage}
                      className="text-xs"
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
            >
              {loading ? "Uploading..." : "Create Banner"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
