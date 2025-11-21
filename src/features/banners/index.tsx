"use client";

import { Provider } from "react-redux";
import BannerUploadForm from "./components/BannerUploadForm";
import BannerList from "./components/BannerList";
import { store } from "@/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BannersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Provider store={store}>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-100 tracking-tight">
              Banner Management
            </h1>
            <Button
              variant="default"
              onClick={() => setShowForm(!showForm)}
              className="h-10 rounded-xl bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? "View Banners" : "Upload Banner"}
            </Button>
          </div>

          {showForm ? (
            <div className="mb-12">
              <BannerUploadForm />
            </div>
          ) : null}

          <BannerList />
        </div>
      </main>
    </Provider>
  );
}