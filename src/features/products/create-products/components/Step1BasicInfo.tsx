// src/components/ProductCreate/Step1BasicInfo.tsx

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  categories: any[];
  selectedCategoryId: string;
  setSelectedCategoryId: React.Dispatch<React.SetStateAction<string>>;
  filteredSubcategories: any[];
  aiLoading: Record<string, boolean>;
  generateWithAI: () => void;
  generateDescription: () => void;
}

const Step1BasicInfo: React.FC<Props> = ({
  formData,
  setFormData,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  filteredSubcategories,
  aiLoading,
  generateWithAI,
  generateDescription
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
      {/* Product Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Product Name *</label>
        <input
          type="text"
          value={formData.productName}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, productName: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Category *</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            setFormData((prev: any) => ({
              ...prev,
              productCategory: e.target.value,
              productSubCategories: [],
            }));
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategories */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Sub Categories</label>
        <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
          {filteredSubcategories.map((sub: any) => (
            <label
              key={sub._id}
              className="flex cursor-pointer items-center space-x-2 rounded p-2 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={formData.productSubCategories.includes(sub._id)}
                onChange={(e) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    productSubCategories: e.target.checked
                      ? [...prev.productSubCategories, sub._id]
                      : prev.productSubCategories.filter((id: string) => id !== sub._id),
                  }));
                }}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{sub.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Brand *</label>
        <input
          type="text"
          value={formData.brand}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, brand: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
          Short Description *
          <button
            type="button"
            onClick={generateWithAI}
            disabled={aiLoading.shortDescription}
            className="flex items-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {aiLoading.shortDescription ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span className="text-xs">Generate with AI</span>
          </button>
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, shortDescription: e.target.value }))}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
          Description *
          <button
            type="button"
            onClick={generateDescription}
            disabled={aiLoading.description}
            className="flex items-center space-x-1 rounded-lg bg-purple-600 px-3 py-1 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {aiLoading.description ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span className="text-xs">Generate with AI</span>
          </button>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );
};

export default Step1BasicInfo;