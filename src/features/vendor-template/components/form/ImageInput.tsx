// src/components/form/ImageInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface ImageInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function ImageInput({ label, value, onChange, name }: ImageInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed && trimmed.startsWith('http')) {
      setPreview(trimmed);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 h-24 w-24 object-cover rounded border"
        />
      )}
    </div>
  );
}