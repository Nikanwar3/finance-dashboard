import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Award, AlertCircle, Target, Activity } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS, MONTHLY_BALANCE_DATA } from '../../data/mockData'

function InsightCard({ icon: Icon, color, title, value, subtitle }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-gray-600 dark:text-gray-300">
          {p.name}: <span className="font-medium">${p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

export default function InsightsView() {
  const { state } = useApp()
  const { transactions, darkMode } = state

  const axisColor = darkMode ? '#6b7280' : '#9ca3af'
  const gridColor = darkMode ? '#1f2937' : '#f3f4f6'

  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const incomes = transactions.filter((t) => t.type === 'income')

    // Category totals
    const catMap = {}
    expenses.forEach((t) => { catMap[t.category] = (catMap[t.category] || 0) + t.amount })
    const catData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const topCategory = catData[0] || null
    const lowestCategory = catData[catData.length - 1] || null

    // Monthly comparison
    const monthlyExp = {}
    const monthlyInc = {}
    expenses.forEach((t) => {
      const key = t.date.slice(0, 7)
      monthlyExp[key] = (monthlyExp[key] || 0) + t.amount
    })
    incomes.forEach((t) => {
      const key = t.date.slice(0, 7)
      monthlyInc[key] = (monthlyInc[key] || 0) + t.amount
    })

    const months = [...new Set([...Object.keys(monthlyExp), ...Object.keys(monthlyInc)])].sort()
    const monthlyData = months.map((m) => ({
      month: new Date(m + '-01').toLocaleDateString('en-US', { month: 'short' }),
      income: monthlyInc[m] || 0,
      expenses: monthlyExp[m] || 0,
    }))

    // Avg monthly expense
    const avgMonthlyExpense = months.length
      ? (expenses.reduce((s, t) => s + t.amount, 0) / months.length).toFixed(2)
      : 0

    // Savings rate
    const totalInc = incomes.reduce((s, t) => s + t.amount, 0)
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0)
    const savingsRate = totalInc > 0 ? ((totalInc - totalExp) / totalInc * 100).toFixed(1) : 0

    // Most active month (most transactions)
    const monthCount = {}
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7)
      monthCount[key] = (monthCount[key] || 0) + 1
    })
    const busiest = Object.entries(monthCount).sort((a, b) => b[1] - a[1])[0]
    const busiestMonth = busiest
      ? `${new Date(busiest[0] + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (${busiest[1]} txns)`
      : 'N/A'

    return { catData, topCategory, lowestCategory, monthlyData, avgMonthlyExpense, savingsRate, busiestMonth }
  }, [transactions])

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Activity size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No data to show insights for yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Key insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <InsightCard
          icon={Award}
          color="bg-amber-500"
          title="Highest Spending Category"
          value={stats.topCategory ? stats.topCategory.name : 'N/A'}
          subtitle={stats.topCategory ? `$${stats.topCategory.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} total spent` : ''}
        />
        <InsightCard
          icon={Target}
          color="bg-emerald-500"
          title="Savings Rate"
          value={`${stats.savingsRate}%`}
          subtitle="of total income saved"
        />
        <InsightCard
          icon={Activity}
          color="bg-brand-600"
          title="Most Active Month"
          value={stats.busiestMonth}
          subtitle=""
        />
        <InsightCard
          icon={TrendingDown}
          color="bg-red-500"
          title="Avg. Monthly Expenses"
          value={`$${Number(stats.avgMonthlyExpense).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle="based on recorded months"
        />
        <InsightCard
          icon={TrendingUp}
          color="bg-purple-500"
          title="Lowest Spending Category"
          value={stats.lowestCategory ? stats.lowestCategory.name : 'N/A'}
          subtitle={stats.lowestCategory ? `$${stats.lowestCategory.value.toLocaleString('en-US', { minimumFractionDigits: 2 })} total` : ''}
        />
        <InsightCard
          icon={AlertCircle}
          color={Number(stats.savingsRate) >= 20 ? 'bg-emerald-500' : 'bg-orange-500'}
          title="Financial Health"
          value={Number(stats.savingsRate) >= 20 ? 'Good' : Number(stats.savingsRate) >= 10 ? 'Fair' : 'Needs attention'}
          subtitle={`Recommended savings rate: 20%+`}
        />
      </div>

      {/* Monthly comparison bar chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Comparison</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Income vs Expenses by month</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stats.monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Spending by Category</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total expenses per category</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={stats.catData}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Expenses" radius={[0, 4, 4, 0]}>
              {stats.catData.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
