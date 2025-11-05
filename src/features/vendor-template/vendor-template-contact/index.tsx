/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { BASE_URL } from '@/store/slices/vendor/productSlice'
import { MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageInput } from '../components/form/ImageInput'
import { ContactPageData } from './type/type'
import { debounce } from 'lodash'

let L: any

function VendorTemplateContact() {
  const [data, setData] = useState<ContactPageData>({
    components: {
      contact_page: {
        hero: {
          backgroundImage: '',
          title: '',
          subtitle: '',
        },
        section_2: {
          hero_title: '',
          hero_subtitle: '',
          hero_title2: '',
          hero_subtitle2: '',
          lat: '',
          long: '',
        },
      },
    },
  })
  const [uploadingPaths, setUploadingPaths] = useState<Set<string>>(new Set())
  const [isMapReady, setIsMapReady] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
const [searchQuery, setSearchQuery] = useState('')
const [suggestions, setSuggestions] = useState<
  { display_name: string; lat: string; lon: string }[]
>([])


const fetchSuggestions = async (query: string) => {
  if (!query.trim()) {
    setSuggestions([])
    return
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5,
      },
      headers: {
        'User-Agent': 'YourAppName/1.0 (your@email.com)', // Be polite
      },
    })
    setSuggestions(response.data)
  } catch (error) {
    console.error('Geocoding failed:', error)
    setSuggestions([])
  }
}

// Debounce to avoid too many requests
const debouncedFetch = useRef(debounce(fetchSuggestions, 400)).current

// Handle search input change
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value
  setSearchQuery(value)
  debouncedFetch(value)
}

// Handle suggestion click
const handleSuggestionClick = (lat: string, lon: string) => {
  setSearchQuery('')
  setSuggestions([])

  // Update form fields
  updateField(['components', 'contact_page', 'section_2', 'lat'], lat)
  updateField(['components', 'contact_page', 'section_2', 'long'], lon)

  // Map will auto-update due to useEffect dependency
}
  const vendor_id = useSelector((state: any) => state.auth?.user?.id)

  // ✅ Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const leafletModule = await import('leaflet')
        L = leafletModule

        // Fix marker icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        setIsMapReady(true)
      }
    }

    loadLeaflet()
  }, [])

  // ✅ Initialize or update the map
  useEffect(() => {
    if (!isMapReady || !L || !mapRef.current) return

    const lat = parseFloat(data.components.contact_page.section_2.lat) || 0
    const lng = parseFloat(data.components.contact_page.section_2.long) || 0

    const defaultCenter: [number, number] =
      lat && lng ? [lat, lng] : [20.5937, 78.9629] // India default
    const defaultZoom = lat && lng ? 14 : 4

    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
      leafletMapRef.current = null
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(defaultCenter, defaultZoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    if (lat && lng) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = marker

      marker.on('dragend', () => {
        const position = marker.getLatLng()
        updateField(
          ['components', 'contact_page', 'section_2', 'lat'],
          position.lat.toString()
        )
        updateField(
          ['components', 'contact_page', 'section_2', 'long'],
          position.lng.toString()
        )
      })
    }

    // Add marker on click
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng

      if (markerRef.current) {
        map.removeLayer(markerRef.current)
      }

      const newMarker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = newMarker

      updateField(
        ['components', 'contact_page', 'section_2', 'lat'],
        lat.toString()
      )
      updateField(
        ['components', 'contact_page', 'section_2', 'long'],
        lng.toString()
      )

      newMarker.on('dragend', () => {
        const pos = newMarker.getLatLng()
        updateField(
          ['components', 'contact_page', 'section_2', 'lat'],
          pos.lat.toString()
        )
        updateField(
          ['components', 'contact_page', 'section_2', 'long'],
          pos.lng.toString()
        )
      })
    })

    leafletMapRef.current = map

    // ✅ Fix misaligned map tiles
    setTimeout(() => {
      map.invalidateSize()
    }, 300)
  }, [
    isMapReady,
    data.components.contact_page.section_2.lat,
    data.components.contact_page.section_2.long,
  ])

  // ✅ Upload to Cloudinary
  async function uploadImage(file: File): Promise<string | null> {
    try {
      const { data: signatureData } = await axios.get(
        `${BASE_URL}/cloudinary/signature`
      )
      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signatureData.apiKey)
      formData.append('timestamp', signatureData.timestamp)
      formData.append('signature', signatureData.signature)
      formData.append('folder', 'ecommerce')

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

  // ✅ Nested object update
  const updateField = (path: string[], value: any) => {
    setData((prev:any) => {
      const clone = JSON.parse(JSON.stringify(prev))
      let current: any = clone
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]]
      }
      current[path[path.length - 1]] = value
      return clone
    })
  }

  // ✅ Handle image input
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
      if (imageUrl) updateField(path, imageUrl)
    } finally {
      setUploadingPaths((prev) => {
        const newSet = new Set(prev)
        newSet.delete(pathKey)
        return newSet
      })
    }
  }

  // ✅ Save contact page
  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/templates/contact`, {
        vendor_id,
        components: data.components.contact_page,
      })
      alert('✅ Contact page saved successfully!')
    } catch (err) {
      console.error('Save failed:', err)
      alert('❌ Failed to save contact page.')
    }
  }

  const isUploading = (path: string[]) => uploadingPaths.has(path.join('.'))

  return (
    <div className='container mx-auto max-w-4xl py-8'>
      <Card className='p-6'>
        <CardTitle className='flex items-center gap-4'>
          Template Preview
          <a
            className='w-fit text-blue-500 hover:underline'
            href={`http://localhost:3000/contact`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <MapPin className='-mt-1' />
          </a>
        </CardTitle>

        <h2 className='mt-2 text-lg font-semibold'>Contact Page</h2>

        {/* Hero Section */}
        <div className='mt-4 space-y-4'>
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
            {isUploading([
              'components',
              'contact_page',
              'hero',
              'backgroundImage',
            ]) && <p className='text-muted-foreground text-sm'>Uploading...</p>}
          </div>

          <Input
            placeholder='Hero Title'
            value={data.components.contact_page.hero.title}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'hero', 'title'],
                e.target.value
              )
            }
          />
          <Input
            placeholder='Hero Subtitle'
            value={data.components.contact_page.hero.subtitle}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'hero', 'subtitle'],
                e.target.value
              )
            }
          />
        </div>

        {/* Section 2 */}
        <div className='mt-6 space-y-4'>
          <h3 className='text-md font-medium'>Section 2 (Location Info)</h3>

          <Input
            placeholder='Section Title'
            value={data.components.contact_page.section_2.hero_title}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'section_2', 'hero_title'],
                e.target.value
              )
            }
          />
          <Input
            placeholder='Section Subtitle'
            value={data.components.contact_page.section_2.hero_subtitle}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'section_2', 'hero_subtitle'],
                e.target.value
              )
            }
          />
          <Input
            placeholder='Second Title (Optional)'
            value={data.components.contact_page.section_2.hero_title2}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'section_2', 'hero_title2'],
                e.target.value
              )
            }
          />
          <Input
            placeholder='Second Subtitle (Optional)'
            value={data.components.contact_page.section_2.hero_subtitle2}
            onChange={(e) =>
              updateField(
                ['components', 'contact_page', 'section_2', 'hero_subtitle2'],
                e.target.value
              )
            }
          />

          {/* Lat/Long */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label>Latitude</Label>
              <Input
                value={data.components.contact_page.section_2.lat}
                onChange={(e) =>
                  updateField(
                    ['components', 'contact_page', 'section_2', 'lat'],
                    e.target.value
                  )
                }
                placeholder='e.g. 20.5937'
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input
                value={data.components.contact_page.section_2.long}
                onChange={(e) =>
                  updateField(
                    ['components', 'contact_page', 'section_2', 'long'],
                    e.target.value
                  )
                }
                placeholder='e.g. 78.9629'
              />
            </div>
          </div>
{/* Map Search */}
<div className='space-y-2'>
  <Label>Search Location</Label>
  <Input
    value={searchQuery}
    onChange={handleSearchChange}
    placeholder='Type an address or place...'
  />
  {suggestions.length > 0 && (
    <ul className='border rounded-md bg-white max-h-60 overflow-auto z-10'>
      {suggestions.map((suggestion, idx) => (
        <li
          key={idx}
          className='px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm'
          onClick={() => handleSuggestionClick(suggestion.lat, suggestion.lon)}
        >
          {suggestion.display_name}
        </li>
      ))}
    </ul>
  )}
</div>

{/* Map */}
<div>
  <Label>Location on Map</Label>
  <div
    ref={mapRef}
    className='leaflet-container mt-1 h-[400px] w-full overflow-hidden rounded-md border bg-gray-100'
  />
  <p className='text-muted-foreground mt-1 text-sm'>
    Click on the map to place your location marker. Drag to adjust.
  </p>
</div>
        
        </div>

        {/* Save Button */}
        <div className='mt-6'>
          <Button onClick={handleSave} disabled={uploadingPaths.size > 0}>
            {uploadingPaths.size > 0
              ? 'Uploading Images...'
              : 'Save Contact Page'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default VendorTemplateContact
