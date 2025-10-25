"use client";


import { Provider } from "react-redux";
import BannerUploadForm from "./components/BannerUploadForm";
import BannerList from "./components/BannerList";
import { store } from "@/store";


export default function BannersPage() {
  return (
    <Provider store={store}>
      <main className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-left mb-8">Banner Management</h1>
        <BannerUploadForm />
        <BannerList />
      </main>
    </Provider>
  );
}
