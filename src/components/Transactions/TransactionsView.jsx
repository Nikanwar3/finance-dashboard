import { useState, useMemo } from 'react'
import {
  Search, SlidersHorizontal, Plus, Pencil, Trash2,
  ChevronUp, ChevronDown, X, Download,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES, CATEGORY_COLORS } from '../../data/mockData'
import TransactionForm from './TransactionForm'

function Badge({ type }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        type === 'income'
          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      }`}
    >
      {type}
    </span>
  )
}

function SortIcon({ field, sortConfig }) {
  if (sortConfig.field !== field)
    return <ChevronUp size={13} className="text-gray-300 dark:text-gray-600" />
  return sortConfig.direction === 'asc'
    ? <ChevronUp size={13} className="text-brand-500" />
    : <ChevronDown size={13} className="text-brand-500" />
}

export default function TransactionsView() {
  const { state, dispatch } = useApp()
  const { transactions, filters, sortConfig, role } = state
  const isAdmin = role === 'admin'

  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const setFilter = (key, value) => dispatch({ type: 'SET_FILTER', key, value })
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' })
  const setSort = (field) => dispatch({ type: 'SET_SORT', field })

  const filtered = useMemo(() => {
    let list = [...transactions]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    if (filters.type !== 'all') list = list.filter((t) => t.type === filters.type)
    if (filters.category !== 'all') list = list.filter((t) => t.category === filters.category)
    if (filters.dateFrom) list = list.filter((t) => t.date >= filters.dateFrom)
    if (filters.dateTo) list = list.filter((t) => t.date <= filters.dateTo)

    list.sort((a, b) => {
      let av = a[sortConfig.field]
      let bv = b[sortConfig.field]
      if (sortConfig.field === 'amount') { av = Number(av); bv = Number(bv) }
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [transactions, filters, sortConfig])

  const activeFilterCount = [
    filters.search, filters.type !== 'all', filters.category !== 'all',
    filters.dateFrom, filters.dateTo,
  ].filter(Boolean).length

  const exportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount'
    const rows = filtered.map(
      (t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    )
    const csv = [header, ...rows].join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'transactions.csv'
    a.click()
  }

  const confirmDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    setDeleteConfirm(null)
  }

  const thCls = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-700/10'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Download size={15} />
          <span className="hidden sm:inline">Export</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[130px]">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilter('type', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="min-w-[160px]">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilter('category', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="min-w-[130px]">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilter('dateFrom', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="min-w-[130px]">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilter('dateTo', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {activeFilterCount > 0 && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={13} /> Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                {[
                  { label: 'Description', field: 'description' },
                  { label: 'Date', field: 'date' },
                  { label: 'Category', field: 'category' },
                  { label: 'Type', field: 'type' },
                  { label: 'Amount', field: 'amount' },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className={`${thCls} cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none`}
                    onClick={() => setSort(field)}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon field={field} sortConfig={sortConfig} />
                    </span>
                  </th>
                ))}
                {isAdmin && <th className={thCls}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-600">
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{t.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (CATEGORY_COLORS[t.category] || '#94a3b8') + '20',
                          color: CATEGORY_COLORS[t.category] || '#94a3b8',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[t.category] || '#94a3b8' }} />
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge type={t.type} /></td>
                    <td className={`px-4 py-3 text-sm font-semibold whitespace-nowrap ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setEditTarget(t); setShowForm(true) }}
                            className="p-1.5 rounded-md text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(t.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Delete Transaction</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <TransactionForm
          transaction={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
    </div>
  )
}
