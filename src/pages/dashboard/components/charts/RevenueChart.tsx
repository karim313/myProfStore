import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Order { totalAmount: number; createdAt: string; status: string }
interface Props { orders: Order[] }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function RevenueChart({ orders }: Props) {
  const data = useMemo(() => {
    const map: Record<string, { month: string; revenue: number }> = {}

    if (!Array.isArray(orders)) return []

    orders.forEach((o: any) => {
      const status = String(o?.status || '').toLowerCase()
      if (status === 'cancelled' || status === 'canceled') return

      const rawAmount = o?.totalAmount ?? o?.totalPrice ?? o?.total ?? o?.price ?? 0
      const amount = Number(rawAmount) || 0

      const dateStr = o?.createdAt ?? o?.orderDate ?? o?.date
      const d = dateStr ? new Date(dateStr) : new Date()
      if (isNaN(d.getTime())) return

      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!map[key]) {
        map[key] = {
          month: `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
          revenue: 0,
        }
      }
      map[key].revenue += amount
    })

    return Object.values(map).slice(-6)
  }, [orders])

  if (!orders.length) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No order data yet</div>
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#00342B" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#00342B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false}
          tickFormatter={v => `$${v}`} width={58} />
        <Tooltip
          formatter={(v: any) => [`$${Number(v || 0).toFixed(2)}`, 'Revenue']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue"
          stroke="#00342B" strokeWidth={2.5}
          fill="url(#revGrad)"
          dot={{ fill: '#00342B', r: 4 }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
