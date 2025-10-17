"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Eye, ExternalLink, Info } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import { fetchBanners } from "@/store/slices/admin/bannerSlice"

export default function BannerList() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedBanner, setSelectedBanner] = useState<any | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  const banners = useSelector((state: any) => state.banners?.banners ?? [])
  const loading = useSelector((state: any) => state.banners?.loading ?? false)
  const error = useSelector((state: any) => state.banners?.error ?? null)

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL_BANNERS;



  useEffect(() => {
    dispatch(fetchBanners())
  }, [dispatch])

  if (loading)
    return <p className="text-center mt-10 text-gray-500 text-lg">Loading banners...</p>
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{String(error)}</p>

  if (!Array.isArray(banners))
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          Expected banners to be an array but got <code>{typeof banners}</code>.
        </p>
      </div>
    )

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a")
    link.href = `${BASE_URL}${url}`
    link.download = title || "banner"
    link.click()
  }

  const handleOpenNewTab = (url: string) => {
    window.open(`${BASE_URL}${url}`, "_blank")
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎨 Banners Gallery</h1>

      {banners.length === 0 ? (
        <p className="text-center text-gray-500">No banners available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: any, i: number) => (
            <motion.div
              key={banner.id ?? i}
              whileHover={{ scale: 1.03 }}
              className="transition relative"
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl border border-gray-100">
                <div className="relative group">
                  <img
                    src={`${BASE_URL}${banner.imageUrl}`}
                    alt={banner.title ?? ""}
                    className="w-full h-56 object-cover rounded-t-lg transition-all duration-300 group-hover:brightness-90"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder-banner.png"
                    }}
                    onClick={() => {
                      setSelectedBanner(banner)
                      setFullscreen(true)
                    }}
                  />
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition bg-black/40">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setSelectedBanner(banner)}
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleOpenNewTab(banner.imageUrl)}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleDownload(banner.imageUrl, banner.title)}
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 text-center">
                  <h2 className="font-semibold text-lg">{banner.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{banner.description}</p>
                  <Button
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => setSelectedBanner(banner)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* 🔍 Details Modal */}
      <Dialog open={!!selectedBanner && !fullscreen} onOpenChange={() => setSelectedBanner(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBanner?.title}</DialogTitle>
          </DialogHeader>
          <img
            src={`${BASE_URL}${selectedBanner?.imageUrl}`}
            alt={selectedBanner?.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-700">{selectedBanner?.description}</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => handleDownload(selectedBanner.imageUrl, selectedBanner.title)}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleOpenNewTab(selectedBanner.imageUrl)}
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Open in Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 🖼️ Fullscreen Preview */}
      <AnimatePresence>
        {fullscreen && selectedBanner && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.img
              src={`${BASE_URL}${selectedBanner.imageUrl}`}
              alt={selectedBanner.title}
              className="max-h-[90vh] rounded-lg shadow-2xl object-contain"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
