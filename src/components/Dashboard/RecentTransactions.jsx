import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORY_COLORS } from '../../data/mockData'

export default function RecentTransactions() {
  const { state, dispatch } = useApp()

  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  if (recent.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h2>
        <p className="text-gray-400 dark:text-gray-600 text-sm text-center py-8">No transactions yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
        <button
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'transactions' })}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
        >
          View all
        </button>
      </div>
      <div className="space-y-2">
        {recent.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: (CATEGORY_COLORS[t.category] || '#94a3b8') + '20' }}
            >
              {t.type === 'income' ? (
                <ArrowUpRight size={16} style={{ color: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
              ) : (
                <ArrowDownRight size={16} style={{ color: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.category} · {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
            <span className={`text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
              {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
