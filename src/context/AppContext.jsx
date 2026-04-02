import { createContext, useContext, useReducer, useEffect } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'

const AppContext = createContext(null)

const STORAGE_KEY = 'finance_dashboard_state'

const initialState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'viewer', // 'viewer' | 'admin'
  darkMode: false,
  filters: {
    search: '',
    type: 'all', // 'all' | 'income' | 'expense'
    category: 'all',
    dateFrom: '',
    dateTo: '',
  },
  sortConfig: {
    field: 'date',
    direction: 'desc',
  },
  activeTab: 'dashboard', // 'dashboard' | 'transactions' | 'insights'
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        ...initialState,
        transactions: parsed.transactions ?? initialState.transactions,
        role: parsed.role ?? initialState.role,
        darkMode: parsed.darkMode ?? initialState.darkMode,
      }
    }
  } catch (_) {}
  return initialState
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }

    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      }

    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters }

    case 'SET_SORT':
      return {
        ...state,
        sortConfig: {
          field: action.field,
          direction:
            state.sortConfig.field === action.field &&
            state.sortConfig.direction === 'asc'
              ? 'desc'
              : 'asc',
        },
      }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }

    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          transactions: state.transactions,
          role: state.role,
          darkMode: state.darkMode,
        })
      )
    } catch (_) {}
  }, [state.transactions, state.role, state.darkMode])

  // Apply dark mode class
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.darkMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
