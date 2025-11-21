/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
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
    link.href = `${url}`
    link.download = title || "banner"
    link.click()
  }

  const handleOpenNewTab = (url: string) => {
    window.open(`${url}`, "_blank")
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
    

      {banners.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No banners available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner: any, i: number) => (
            <motion.div
              key={banner.id ?? i}
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="relative group">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title ?? ""}
                    className="w-full h-56 object-cover transition-all duration-300 group-hover:opacity-90"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder-banner.png"
                    }}
                    onClick={() => {
                      setSelectedBanner(banner)
                      setFullscreen(true)
                    }}
                  />
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 dark:bg-black/50">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-white/90 hover:bg-gray-100 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBanner(banner)
                      }}
                    >
                      <Info className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-white/90 hover:bg-gray-100 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNewTab(banner.imageUrl)
                      }}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-white/90 hover:bg-gray-100 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(banner.imageUrl, banner.title)
                      }}
                    >
                      <Download className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5 text-center">
                  <h2 className="font-medium text-lg text-gray-800 dark:text-gray-200 tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {banner.description}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-750"
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

      {/* Details Modal */}
      <Dialog open={!!selectedBanner && !fullscreen} onOpenChange={() => setSelectedBanner(null)}>
        <DialogContent className="max-w-lg rounded-2xl border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">
              {selectedBanner?.title}
            </DialogTitle>
          </DialogHeader>
          <img
            src={selectedBanner?.imageUrl}
            alt={selectedBanner?.title}
            className="w-full h-64 object-cover rounded-xl"
          />
          <p className="text-gray-700 dark:text-gray-300">
            {selectedBanner?.description}
          </p>
          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-750"
              onClick={() => handleDownload(selectedBanner.imageUrl, selectedBanner.title)}
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-750"
              onClick={() => handleOpenNewTab(selectedBanner.imageUrl)}
            >
              <ExternalLink className="w-4 h-4 mr-2" /> Open
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Preview */}
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
              src={selectedBanner.imageUrl}
              alt={selectedBanner.title}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}