import { Menu, Moon, Sun, Shield, Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const TAB_LABELS = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
}

export default function Header({ onMenuClick }) {
  const { state, dispatch } = useApp()

  const setRole = (role) => dispatch({ type: 'SET_ROLE', payload: role })
  const toggleDark = () => dispatch({ type: 'TOGGLE_DARK_MODE' })

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 lg:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {TAB_LABELS[state.activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setRole('viewer')}
            title="Viewer — read only"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              state.role === 'viewer'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
          <button
            onClick={() => setRole('admin')}
            title="Admin — full access"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              state.role === 'admin'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Toggle dark mode"
        >
          {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
