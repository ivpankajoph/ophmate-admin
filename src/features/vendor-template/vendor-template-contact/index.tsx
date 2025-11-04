/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageInput } from '../components/form/ImageInput'
import { initialData, TemplateData } from '../data'
import { BASE_URL } from '@/store/slices/vendor/productSlice'

// Dynamically import Leaflet (to avoid SSR issues)
let L: any

function VendorTemplateContact() {
  const [data, setData] = useState<TemplateData>(initialData)
  const [uploadingPaths, setUploadingPaths] = useState<Set<string>>(new Set())
  const [isMapReady, setIsMapReady] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const vendor_id = useSelector((state: any) => state.auth.user.id)

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        // Import Leaflet dynamically
        const leafletModule = await import('leaflet')
        L = leafletModule.default || leafletModule

        // Fix icon path issue in Vite/React
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        setIsMapReady(true)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize or update map
  useEffect(() => {
    if (!isMapReady || !L || !mapRef.current) return

    const lat = parseFloat(data.components.contact_page.section_2.lat) || 0
    const lng = parseFloat(data.components.contact_page.section_2.long) || 0

    const defaultCenter: [number, number] = lat && lng ? [lat, lng] : [40.7128, -74.006] // NYC fallback
    const defaultZoom = lat && lng ? 15 : 2

    // Clean up previous map if exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
    }
    if (markerRef.current) {
      markerRef.current = null
    }

    // Create new map
    const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom)

    // Add OpenStreetMap tile layer (FREE, no key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    // Add marker if coordinates exist
    if (lat && lng) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = marker

      marker.on('dragend', () => {
        const position = marker.getLatLng()
        updateField(['components', 'contact_page', 'section_2', 'lat'], position.lat.toString())
        updateField(['components', 'contact_page', 'section_2', 'long'], position.lng.toString())
      })
    }

    // Click to place new marker
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng

      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = newMarker

      updateField(['components', 'contact_page', 'section_2', 'lat'], lat.toString())
      updateField(['components', 'contact_page', 'section_2', 'long'], lng.toString())

      newMarker.on('dragend', () => {
        const position = newMarker.getLatLng()
        updateField(['components', 'contact_page', 'section_2', 'lat'], position.lat.toString())
        updateField(['components', 'contact_page', 'section_2', 'long'], position.lng.toString())
      })
    })

    leafletMapRef.current = map
  }, [isMapReady, data.components.contact_page.section_2.lat, data.components.contact_page.section_2.long])

  // Cloudinary upload
  async function uploadImage(file: File): Promise<string | null> {
    try {
      const { data: signatureData } = await axios.get(`${BASE_URL}/cloudinary/signature`)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signatureData.apiKey)
      formData.append('timestamp', signatureData.timestamp)
      formData.append('signature', signatureData.signature)
      formData.append('folder', 'ecommerce/contact')
      
      // 🔧 Fixed URL: removed extra spaces
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        formData
      )
      return uploadRes.data.secure_url
    } catch (error) {
      console.error('Cloudinary upload failed:', error)
      alert('Failed to upload image. Please try again.')
      return null
    }
  }

  const updateField = (path: string[], value: any) => {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev))
      let current: any = clone
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return clone
    })
  }

  const handleImageChange = async (path: string[], file: File | null) => {
    const pathKey = path.join('.')
    if (!file) {
      updateField(path, '')
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
      return
    }

    setUploadingPaths((prev) => new Set(prev).add(pathKey))
    try {
      const imageUrl = await uploadImage(file)
      updateField(path, imageUrl || '')
    } finally {
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
    }
  }

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/templates/contact`, {
        vendor_id,
        components: data.components.contact_page,
      })
      alert('Contact page saved successfully!')
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save contact page.')
    }
  }

  const isUploading = (path: string[]) => uploadingPaths.has(path.join('.'))

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <Card className='p-6'>
        <CardTitle className='flex gap-4'>
          Template Preview{' '}
          <a
            className='w-fit'
            href={`http://localhost:3000/contact`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <MapPin className='-mt-1' />
          </a>
        </CardTitle>
        <h2 className='text-lg font-semibold'>Contact Page</h2>

        {/* Hero Section */}
        <div className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <ImageInput
              label='Hero Background'
              name='contactHeroBg'
              value={data.components.contact_page.hero.backgroundImage}
              onChange={(file) =>
                handleImageChange(
                  ['components', 'contact_page', 'hero', 'backgroundImage'],
                  file
                )
              }
              isFileInput={true}
            />
            {isUploading(['components', 'contact_page', 'hero', 'backgroundImage']) && (
              <p className='text-sm text-muted-foreground'>Uploading...</p>
            )}
          </div>

          <Input
            placeholder='Hero Title'
            value={data.components.contact_page.hero.title}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'hero', 'title'], e.target.value)
            }
          />
          <Input
            placeholder='Hero Subtitle'
            value={data.components.contact_page.hero.subtitle}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'hero', 'subtitle'], e.target.value)
            }
          />
        </div>

        {/* Section 2 */}
        <div className='space-y-4 mt-6'>
          <h3 className='text-md font-medium'>Section 2 (Location Info)</h3>

          <Input
            placeholder='Section Title'
            value={data.components.contact_page.section_2.hero_title || ''}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'section_2', 'hero_title'], e.target.value)
            }
          />
          <Input
            placeholder='Section Subtitle'
            value={data.components.contact_page.section_2.hero_subtitle || ''}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'section_2', 'hero_subtitle'], e.target.value)
            }
          />
          <Input
            placeholder='Second Title (Optional)'
            value={data.components.contact_page.section_2.hero_title2 || ''}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'section_2', 'hero_title2'], e.target.value)
            }
          />
          <Input
            placeholder='Second Subtitle (Optional)'
            value={data.components.contact_page.section_2.hero_subtitile2 || ''}
            onChange={(e) =>
              updateField(['components', 'contact_page', 'section_2', 'hero_subtitile2'], e.target.value)
            }
          />

          {/* Lat/Long */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Latitude</Label>
              <Input
                value={data.components.contact_page.section_2.lat || ''}
                onChange={(e) =>
                  updateField(['components', 'contact_page', 'section_2', 'lat'], e.target.value)
                }
                placeholder='e.g. 40.7128'
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={data.components.contact_page.section_2.long || ''}
                onChange={(e) =>
                  updateField(['components', 'contact_page', 'section_2', 'long'], e.target.value)
                }
                placeholder='e.g. -74.0060'
              />
            </div>
          </div>

          {/* Map (Free - OpenStreetMap) */}
          <div>
            <Label>Location on Map</Label>
            <div
              ref={mapRef}
              className='w-full h-64 border rounded-md mt-1 bg-gray-100'
            />
            <p className='text-sm text-muted-foreground mt-1'>
              Click on the map to place your location marker. Drag to adjust.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className='mt-6'>
          <Button onClick={handleSave} disabled={uploadingPaths.size > 0}>
            {uploadingPaths.size > 0 ? 'Uploading Images...' : 'Save Contact Page'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default VendorTemplateContact