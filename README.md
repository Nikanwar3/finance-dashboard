# FinTrack — Finance Dashboard UI

A clean, interactive finance dashboard built with **React + Vite + Tailwind CSS + Recharts**.

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Features

### Dashboard Overview
- **Summary cards** — Total Balance, Income, Expenses, Net Savings with live calculations
- **Balance Trend chart** — Area chart showing monthly Income / Expenses / Balance over 6 months (Recharts)
- **Spending Breakdown** — Pie chart of expenses by category with colour-coded labels
- **Recent Transactions** — 6 most recent entries with quick link to full list

### Transactions
- Full **sortable table** — click any column header to sort ascending/descending
- **Search** by description or category
- **Filter panel** — by type (income/expense), category, and date range
- Active filter count badge; one-click clear all
- **Export to CSV** — downloads filtered transactions as a `.csv` file
- **Admin: Add / Edit / Delete** transactions via a modal form with validation

### Role-Based UI
Toggle between **Viewer** and **Admin** using the header switcher:
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard, transactions, insights | ✅ | ✅ |
| Add new transaction | ❌ | ✅ |
| Edit / Delete transaction | ❌ | ✅ |

No backend required — role is managed in React context and persisted to `localStorage`.

### Insights
- **Highest / Lowest spending category**
- **Savings rate** with health indicator
- **Most active month** (by transaction count)
- **Average monthly expenses**
- **Monthly comparison bar chart** — Income vs Expenses side-by-side per month
- **Spending by category** horizontal bar chart with per-category colours

### Dark Mode
Click the sun/moon icon in the header. Preference persists across page reloads via `localStorage`.

### Data Persistence
Transactions, role selection, and dark mode preference are all saved to `localStorage` so state survives a page refresh.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v3 | Utility-first styling |
| Recharts | Charts (Area, Pie, Bar) |
| Lucide React | Icons |
| React Context + useReducer | State management |
| localStorage | Data persistence |

---

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── DashboardView.jsx      # Composes all dashboard widgets
│   │   ├── SummaryCards.jsx       # 4 KPI cards
│   │   ├── BalanceTrend.jsx       # Area chart
│   │   ├── SpendingBreakdown.jsx  # Pie chart
│   │   └── RecentTransactions.jsx # Last 6 transactions
│   ├── Transactions/
│   │   ├── TransactionsView.jsx   # Full transactions table + filters
│   │   └── TransactionForm.jsx    # Add/Edit modal form
│   ├── Insights/
│   │   └── InsightsView.jsx       # Insight cards + 2 charts
│   └── Layout/
│       ├── Sidebar.jsx            # Navigation sidebar
│       └── Header.jsx             # Top bar (role switcher, dark mode)
├── context/
│   └── AppContext.jsx             # Global state (useReducer + localStorage)
├── data/
│   └── mockData.js                # 60 sample transactions + chart data
├── App.jsx                        # Root layout shell
└── main.jsx                       # Entry point
```

---

## Assumptions & Decisions

- **No backend** — all data is mock/static with localStorage persistence
- **Role switching** is a UI-only demonstration; no authentication
- Monthly chart data uses a separate `MONTHLY_BALANCE_DATA` constant (pre-aggregated) to keep the chart smooth across the fixed 6-month window
- The 60 mock transactions cover Jan–Jun 2025 to give the Insights section meaningful data out of the box
