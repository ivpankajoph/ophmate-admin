import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, resetProductState } from "@/store/slices/vendor/productSlice";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/axios";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  short_description: z.string().min(5, "Short description is required"),
  description: z.string().min(10, "Description is required"),
  base_price: z.string(),
  mrp: z.string(),
  discount_percent: z.string(),
  category_id: z.string().min(1, "Please select a category"),
  status: z.string(),
  media: z.any(),
  size: z.string().optional(),
  color: z.string().optional(),
  brand: z.string().optional(),
  warranty: z.string().optional(),
  expiry_date: z.string().optional(),
  weight: z.string().optional(),
});

export default function CreateProductPage() {
  const dispatch = useDispatch<any>();
  const { loading } = useSelector((state: any) => state.product);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "media") {
        if (data.media && data.media[0]) formData.append("media", data.media[0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    const result = await dispatch(createProduct(formData));
    if (createProduct.fulfilled.match(result)) {
      Swal.fire({
        title: "✅ Product Created!",
        text: "Your product has been added successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      reset();
      dispatch(resetProductState());
    }
  };

  const categoryId = watch("category_id");

  return (
    <motion.div
      className="flex justify-center items-center py-10 px-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-slate-700">
            🛍️ Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("name")} placeholder="Product Name" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

            <Input {...register("short_description")} placeholder="Short Description" />
            <Textarea {...register("description")} placeholder="Description" />

            <div className="grid grid-cols-2 gap-3">
              <Input {...register("base_price")} placeholder="Base Price" type="number" />
              <Input {...register("mrp")} placeholder="MRP" type="number" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input {...register("discount_percent")} placeholder="Discount (%)" type="number" />
              {/* Category Dropdown */}
              <select
                {...register("category_id")}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border rounded-md p-2 text-sm text-gray-700"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 🧩 Conditional fields based on category */}
            {categoryId === "clothing" && (
              <div className="grid grid-cols-2 gap-3">
                <Input {...register("size")} placeholder="Size (e.g. M, L, XL)" />
                <Input {...register("color")} placeholder="Color" />
              </div>
            )}

            {categoryId === "electronics" && (
              <div className="grid grid-cols-2 gap-3">
                <Input {...register("brand")} placeholder="Brand" />
                <Input {...register("warranty")} placeholder="Warranty (months)" />
              </div>
            )}

            {categoryId === "food" && (
              <div className="grid grid-cols-2 gap-3">
                <Input {...register("expiry_date")} placeholder="Expiry Date" type="date" />
                <Input {...register("weight")} placeholder="Weight (grams)" />
              </div>
            )}

            <select
              {...register("status")}
              className="w-full border rounded-md p-2 text-sm text-gray-700"
            >
              <option value="">Select Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>

            <Input type="file" accept="image/*" {...register("media")} />

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
