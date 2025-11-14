import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Copy, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// -------------------- Types --------------------

export type SpecRow = {
  key: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  unit: string;
  options: string[];
  required: boolean;
  group: string;
}

export type SpecificationsPayload = {
  specifications: Array<{ key: string; value: string }> // what your backend expects
  raw: SpecRow[] // richer UI model (not required by backend, but handy if you want to store it)
}

// -------------------- Category-based templates --------------------

const categoryTemplates: Record<string, SpecRow[]> = {
  electronics: [
    { key: 'Brand', value: '', type: 'text', unit: '', options: [], required: true, group: 'Basics' },
    { key: 'Model', value: '', type: 'text', unit: '', options: [], required: true, group: 'Basics' },
    { key: 'Color', value: '', type: 'text', unit: '', options: [], required: false, group: 'Appearance' },
    { key: 'Weight', value: '', type: 'number', unit: 'kg', options: [], required: false, group: 'Physical' },
    { key: 'Dimensions', value: '', type: 'text', unit: 'cm', options: [], required: false, group: 'Physical' },
    { key: 'Warranty', value: '', type: 'text', unit: 'months', options: [], required: false, group: 'Support' },
    { key: 'Power', value: '', type: 'number', unit: 'W', options: [], required: false, group: 'Technical' },
    { key: 'Connectivity', value: '', type: 'select', unit: '', options: ['Wi-Fi', 'Bluetooth', 'USB'], required: false, group: 'Features' },
  ],
  clothing: [
    { key: 'Brand', value: '', type: 'text', unit: '', options: [], required: true, group: 'Basics' },
    { key: 'Size', value: '', type: 'select', unit: '', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true, group: 'Fit' },
    { key: 'Color', value: '', type: 'text', unit: '', options: [], required: true, group: 'Appearance' },
    { key: 'Material', value: '', type: 'text', unit: '', options: [], required: false, group: 'Material' },
    { key: 'Gender', value: '', type: 'select', unit: '', options: ['Male', 'Female', 'Unisex'], required: false, group: 'Target' },
    { key: 'Season', value: '', type: 'select', unit: '', options: ['Spring', 'Summer', 'Fall', 'Winter'], required: false, group: 'Seasonal' },
    { key: 'Care Instructions', value: '', type: 'text', unit: '', options: [], required: false, group: 'Info' },
    { key: 'Sleeve Length', value: '', type: 'text', unit: 'cm', options: [], required: false, group: 'Fit' },
  ],
  furniture: [
    { key: 'Brand', value: '', type: 'text', unit: '', options: [], required: true, group: 'Basics' },
    { key: 'Material', value: '', type: 'text', unit: '', options: [], required: false, group: 'Material' },
    { key: 'Color', value: '', type: 'text', unit: '', options: [], required: false, group: 'Appearance' },
    { key: 'Dimensions', value: '', type: 'text', unit: 'cm', options: [], required: false, group: 'Physical' },
    { key: 'Weight', value: '', type: 'number', unit: 'kg', options: [], required: false, group: 'Physical' },
    { key: 'Assembly Required', value: 'false', type: 'boolean', unit: '', options: [], required: false, group: 'Setup' },
    { key: 'Warranty', value: '', type: 'text', unit: 'months', options: [], required: false, group: 'Support' },
    { key: 'Room Type', value: '', type: 'select', unit: '', options: ['Living Room', 'Bedroom', 'Kitchen', 'Office'], required: false, group: 'Placement' },
  ],
  default: [
    { key: 'Brand', value: '', type: 'text', unit: '', options: [], required: true, group: 'Basics' },
    { key: 'Color', value: '', type: 'text', unit: '', options: [], required: false, group: 'Appearance' },
    { key: 'Weight', value: '', type: 'number', unit: 'kg', options: [], required: false, group: 'Physical' },
    { key: 'Warranty', value: '', type: 'text', unit: 'months', options: [], required: false, group: 'Support' },
  ]
}

// -------------------- Row Component --------------------

const Row: React.FC<{
  row: SpecRow
  onChange: (next: SpecRow) => void
  onDelete: () => void
  onDuplicate: () => void
}> = ({ row, onChange, onDelete, onDuplicate }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className='grid grid-cols-12 gap-2 rounded-2xl border p-3 md:p-4'
    >
      <div className='col-span-12 space-y-2 md:col-span-3'>
        <Label>Key</Label>
        <Input
          placeholder='e.g. Material'
          value={row.key}
          onChange={(e) => onChange({ ...row, key: e.target.value })}
        />
      </div>

      <div className='col-span-12 space-y-2 md:col-span-3'>
        <Label>Value</Label>
        {row.type === 'boolean' ? (
          <div className='flex items-center gap-3 pt-2'>
            <Switch
              checked={row.value === 'true'}
              onCheckedChange={(v) =>
                onChange({ ...row, value: v ? 'true' : 'false' })
              }
            />
            <Badge variant='secondary'>
              {row.value === 'true' ? 'Yes' : 'No'}
            </Badge>
          </div>
        ) : (
          <Input
            placeholder='e.g. Cotton'
            value={row.value}
            onChange={(e) => onChange({ ...row, value: e.target.value })}
          />
        )}
      </div>

      <div className='col-span-6 space-y-2 md:col-span-2'>
        <Label>Type</Label>
        <Select
          value={row.type}
          onValueChange={(v) => onChange({ ...row, type: v as any })}
        >
          <SelectTrigger>
            <SelectValue placeholder='Choose' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='text'>Text</SelectItem>
            <SelectItem value='number'>Number</SelectItem>
            <SelectItem value='boolean'>Boolean</SelectItem>
            <SelectItem value='select'>Select</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='col-span-6 space-y-2 md:col-span-2'>
        <Label>Unit</Label>
        <Input
          placeholder='e.g. cm, kg, W'
          value={row.unit}
          onChange={(e) => onChange({ ...row, unit: e.target.value })}
        />
      </div>

      <div className='col-span-12 space-y-2 md:col-span-2'>
        <Label>Group</Label>
        <Input
          placeholder='e.g. Physical'
          value={row.group}
          onChange={(e) => onChange({ ...row, group: e.target.value })}
        />
      </div>

      {row.type === 'select' && (
        <div className='col-span-12 space-y-2'>
          <Label>Options (comma separated)</Label>
          <Input
            placeholder='e.g. Small, Medium, Large'
            value={row.options.join(', ')}
            onChange={(e) =>
              onChange({
                ...row,
                options: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
      )}

      <div className='col-span-12 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <Switch
              checked={row.required}
              onCheckedChange={(v) => onChange({ ...row, required: v })}
            />
            <Label className='text-sm'>Required</Label>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' size='icon' onClick={onDuplicate}>
                  <Copy className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate row</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='destructive' size='icon' onClick={onDelete}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete row</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}

// -------------------- Main Component --------------------

export default function SpecificationSection() {
  const [rows, setRows] = useState<SpecRow[]>([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('default');

  // Initialize with default category
  useEffect(() => {
    setRows([...categoryTemplates[category]]);
  }, [category]);

  const filteredRows = useMemo(
    () =>
      rows.filter((r) =>
        `${r.key} ${r.group} ${r.value}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      ),
    [rows, filter]
  );

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        key: '',
        value: '',
        type: 'text',
        unit: '',
        options: [],
        required: false,
        group: 'General',
      },
    ]);

  const removeRow = (idx: number) =>
    setRows((prev) => prev.filter((_, i) => i !== idx));

  const updateRow = (idx: number, next: SpecRow) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? next : r)));

  const duplicateRow = (idx: number) =>
    setRows((prev) => {
      const copy = { ...prev[idx] };
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
    });

  // const applyTemplate = (templateCategory: string) => {
  //   setCategory(templateCategory);
  //   setRows([...categoryTemplates[templateCategory]]);
  // };

  return (
    <div className='mx-auto max-w-6xl space-y-6'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Product Specifications
          </h2>
          <p className='text-muted-foreground text-sm'>
            Add detailed, structured attributes for your product. Export as
            key/value for your backend.
          </p>
        </div>
      </div>

      <Tabs defaultValue='editor' className='w-full'>
        <TabsContent value='editor' className='space-y-4'>
          <Card className='border-dashed'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Specification Rows</CardTitle>
              <CardDescription>
                Add, duplicate, or remove rows. Group related specs and choose
                types.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Button onClick={addRow}>
                    <Plus className='mr-2 h-4 w-4' /> Add Row
                  </Button>
                  
                  <div className='flex items-center gap-2'>
                    <Label>Category:</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="default">Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className='hidden items-center gap-2 md:flex'>
                    <Badge variant='secondary'>Total: {rows.length}</Badge>
                  </div>
                </div>
                
                <div className='flex items-center gap-2'>
                  <Filter className='text-muted-foreground h-4 w-4' />
                  <Input
                    placeholder='Filter by key/value/group'
                    className='w-[260px]'
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <ScrollArea className='h-[520px] rounded-2xl border p-3'>
                <div className='grid gap-3'>
                  {filteredRows.length === 0 && (
                    <p className='text-muted-foreground text-center text-sm'>
                      No rows. Add or apply a template to get started.
                    </p>
                  )}

                  {filteredRows.map((r, visibleIdx) => {
                    // Find the real index in rows array
                    const realIdx = rows.findIndex((x, i) => i >= 0 && x === r);
                    return (
                      <Row
                        key={`${r.key}-${visibleIdx}`}
                        row={r}
                        onChange={(next) => updateRow(realIdx, next)}
                        onDelete={() => removeRow(realIdx)}
                        onDuplicate={() => duplicateRow(realIdx)}
                      />
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Tips</CardTitle>
          <CardDescription>
            • Change <span className='font-medium'>Type</span> to Boolean for
            on/off values. • Use <span className='font-medium'>Unit</span> for
            sizes (cm, kg, W). • Apply a{' '}
            <span className='font-medium'>Category Template</span> to prefill common
            fields.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}