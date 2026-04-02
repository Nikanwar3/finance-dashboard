import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function Card({ title, value, icon: Icon, color, trend, trendLabel }) {
  const isPositive = trend >= 0
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        {trendLabel && (
          <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {trendLabel}
          </p>
        )}
      </div>
    </div>
  )
}

export default function SummaryCards() {
  const { state } = useApp()
  const { transactions } = state

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Savings rate
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  const cards = [
    {
      title: 'Total Balance',
      value: balance,
      icon: Wallet,
      color: 'bg-brand-600',
      trend: balance,
      trendLabel: `${savingsRate}% savings rate`,
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      trend: 1,
      trendLabel: `${transactions.filter((t) => t.type === 'income').length} transactions`,
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingDown,
      color: 'bg-red-500',
      trend: -1,
      trendLabel: `${transactions.filter((t) => t.type === 'expense').length} transactions`,
    },
    {
      title: 'Net Savings',
      value: balance > 0 ? balance : 0,
      icon: PiggyBank,
      color: 'bg-amber-500',
      trend: balance,
      trendLabel: balance >= 0 ? 'On track' : 'Over budget',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </div>
  )
}
