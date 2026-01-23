import { createFileRoute } from "@tanstack/react-router"
import VendorAnalytics from "@/features/vendor-analytics"

export const Route = createFileRoute("/_authenticated/vendor-analytics/")({
  component: VendorAnalytics,
})
