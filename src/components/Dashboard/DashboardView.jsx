import SummaryCards from './SummaryCards'
import BalanceTrend from './BalanceTrend'
import SpendingBreakdown from './SpendingBreakdown'
import RecentTransactions from './RecentTransactions'

export default function DashboardView() {
  return (
    <div className="space-y-5">
      <SummaryCards />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <BalanceTrend />
        </div>
        <div className="xl:col-span-2">
          <SpendingBreakdown />
        </div>
      </div>
      <RecentTransactions />
    </div>
  )
}
