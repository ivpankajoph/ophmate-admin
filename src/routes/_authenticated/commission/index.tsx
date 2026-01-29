import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type CommissionRule = {
  category_id: string
  category_name: string
  percent: number
  is_active: boolean
}

export const Route = createFileRoute('/_authenticated/commission/')({
  component: CommissionPage,
})

function CommissionPage() {
  const [rules, setRules] = useState<CommissionRule[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchRules = async () => {
    try {
      setLoading(true)
      const res = await api.get('/commission')
      setRules(res.data.rules || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return rules
    const query = search.toLowerCase()
    return rules.filter((rule) =>
      rule.category_name.toLowerCase().includes(query),
    )
  }, [rules, search])

  const updateRule = async (rule: CommissionRule) => {
    try {
      setSavingId(rule.category_id)
      await api.put(`/commission/${rule.category_id}`, {
        percent: rule.percent,
        is_active: rule.is_active,
      })
    } finally {
      setSavingId(null)
    }
  }

  const updatePercent = (categoryId: string, value: string) => {
    const percent = Math.max(0, Math.min(100, Number(value || 0)))
    setRules((prev) =>
      prev.map((rule) =>
        rule.category_id === categoryId ? { ...rule, percent } : rule,
      ),
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-900'>Commission Rules</h1>
          <p className='text-sm text-muted-foreground'>
            Configure category-level commission cuts for marketplace orders.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search category'
            className='w-64'
          />
          <Button onClick={fetchRules} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Category commission</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className='text-sm text-muted-foreground'>Loading categories...</p>}
          {!loading && filtered.length === 0 && (
            <p className='text-sm text-muted-foreground'>No categories found.</p>
          )}
          <div className='space-y-3'>
            {filtered.map((rule) => (
              <div
                key={rule.category_id}
                className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3'
              >
                <div>
                  <p className='text-sm font-semibold text-slate-900'>
                    {rule.category_name}
                  </p>
                  <p className='text-xs text-muted-foreground'>Default 18% if unset</p>
                </div>
                <div className='flex items-center gap-3'>
                  <Input
                    type='number'
                    min={0}
                    max={100}
                    step={0.1}
                    value={rule.percent}
                    onChange={(e) => updatePercent(rule.category_id, e.target.value)}
                    className='w-24'
                  />
                  <span className='text-xs text-muted-foreground'>%</span>
                  <Button
                    size='sm'
                    onClick={() => updateRule(rule)}
                    disabled={savingId === rule.category_id}
                  >
                    {savingId === rule.category_id ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
