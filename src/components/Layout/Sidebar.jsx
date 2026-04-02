import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { state, dispatch } = useApp()

  const setTab = (tab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
    onClose?.()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg">
              FinTrack
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = state.activeTab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-brand-50 dark:bg-brand-700/20 text-brand-600 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Role badge */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase">
                {state.role[0]}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 dark:text-white capitalize">
                {state.role}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.role === 'admin' ? 'Full access' : 'Read only'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
