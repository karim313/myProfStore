import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Order { status: string }
interface Props { orders: Order[] }

const STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Pending',    color: '#F59E0B' },
  processing: { label: 'Processing', color: '#3B82F6' },
  shipped:    { label: 'Shipped',    color: '#8B5CF6' },
  completed:  { label: 'Completed',  color: '#10B981' },
  cancelled:  { label: 'Cancelled',  color: '#EF4444' },
}

export default function OrdersStatusChart({ orders }: Props) {
  const data = Object.entries(
    orders.reduce((acc, o: any) => {
      const st = String(o?.status || 'pending').toLowerCase()
      acc[st] = (acc[st] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  )
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({
      name: STATUS[key]?.label ?? key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: STATUS[key]?.color ?? '#9CA3AF',
    }))

  if (!orders.length) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No orders yet</div>
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%"
          innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip
          formatter={(v: any, name: any) => [v, name]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
