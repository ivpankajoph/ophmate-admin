// src/components/form/ImageInput.tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function ImageInput({
  label,
  name,
  value, // string (preview URL) or null
  onChange,
  isFileInput = false,
}: {
  label: string
  name: string
  value: string | null
  onChange: (file: File | null) => void
  isFileInput?: boolean
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onChange(file)
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor={name}>{label}</Label>
      {isFileInput ? (
        <>
          <Input id={name} type='file' accept='image/*' onChange={handleFileChange} />
          {value && (
            <img
              src={value}
              alt={label}
              className='mt-2 max-h-32 rounded border object-contain'
            />
          )}
        </>
      ) : (
        <Input
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value as any)}
        />
      )}
    </div>
  )
}