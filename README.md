# FinTrack — Finance Dashboard

A personal finance dashboard to track spending, visualize trends, and understand where your money goes. Built with React.js, Tailwind CSS, and Recharts.

Live demo of project: https://finance-dashboard-cy38.onrender.com.

---

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

```bash
npm run build   # production build → dist/
```

---

## What's Inside

**Dashboard**
Four summary cards (Balance, Income, Expenses, Savings) that update live based on transaction data. Below that, an area chart showing income vs expenses over 6 months, a pie chart breaking down spending by category, and a quick view of recent all transactions.

**Transactions**
A full table with sorting on every column, a search bar, and a filter panel (type, category, date range). A badge shows how many filters are active. There's also a CSV export that respects whatever filters you have applied.

Admin role unlocks Add, Edit, and Delete. The form has basic validations and opens in a modal.

**Role-Based UI**
Toggle between Viewer and Admin in the header. Viewer is read-only. Admin gets the full CRUD controls. Role persists across refreshes.

**Insights**
A few observations pulled from the data — top spending category, savings rate with a health indicator, most active month, average monthly expenses — plus a monthly comparison bar chart and a horizontal bar chart by category.

**Dark Mode + Persistence**
Dark mode toggle in the header. Transactions, role, and theme are all saved to localStorage so nothing resets on refresh.

---

## Stack

- React 18 + Vite
- Tailwind CSS v3
- Recharts (Area, Pie, Bar)
- Lucide React (icons)
- React Context + useReducer
- localStorage for persistence.

---

## Structure

```
src/
├── components/
│   ├── Dashboard/       # SummaryCards, BalanceTrend, SpendingBreakdown, RecentTransactions
│   ├── Transactions/    # TransactionsView (table + filters), TransactionForm (modal)
│   ├── Insights/        # InsightsView (cards + charts)
│   └── Layout/          # Sidebar, Header
├── context/
│   └── AppContext.jsx   # Global state via useReducer, localStorage sync
├── data/
│   └── mockData.js      # 60 mock transactions (Jan–Jun 2025) + monthly charts data
├── App.jsx
└── main.jsx
```

---

## Notes

The app ships with 60 mock transactions across Jan–Jun 2025 so the charts and insights have real data to work with from the start.

The balance trend chart uses pre-aggregated monthly data rather than computing it live from transactions. This was intentional — the chart covers a fixed 6-month window and stays stable regardless of which transactions get added or deleted. The insights charts derive live from whatever transactions exist.

No backend, no auth. Role switching is purely a UI simulations
