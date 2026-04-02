import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import DashboardView from './components/Dashboard/DashboardView'
import TransactionsView from './components/Transactions/TransactionsView'
import InsightsView from './components/Insights/InsightsView'

function AppShell() {
  const { state } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const views = {
    dashboard: <DashboardView />,
    transactions: <TransactionsView />,
    insights: <InsightsView />,
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {views[state.activeTab] ?? <DashboardView />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
