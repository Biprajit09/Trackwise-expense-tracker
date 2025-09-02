"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingPage from "../components/LoadingPage";




// Lucide icons
import {
  Wallet,
  PieChart,
  PlusCircle,
  LogOut,
  TrendingUp,
  Scale,
} from "lucide-react";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

/** Helpers */
function currentMonthYYYYMM() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}`;
}

// Helper to format a Date to YYYY-MM-DD using local date parts (avoids UTC shift)
function localDateToISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthRange(yyyyMM) {
  const [y, m] = yyyyMM.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);

  // Use localDateToISO to avoid timezone-related date rollovers
  const startIso = localDateToISO(start);
  const endIso = localDateToISO(end);
  return { startIso, endIso, year: y, month: m - 1 };
}

function monthLabel(yyyyMM) {
  const [y, m] = yyyyMM.split("-").map(Number);
  return new Date(y, m - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getDaysInMonth(year, month) {
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
}

function prepareChartData(expenses, year, month) {
  const days = getDaysInMonth(year, month);

  // Build map only counting expenses that belong to the desired year & month
  const expenseMap = expenses.reduce((acc, e) => {
    // Ensure we can parse the date robustly
    const d = new Date(e.date);
    if (Number.isNaN(d.getTime())) return acc; // skip invalid dates

    const eYear = d.getFullYear();
    const eMonth = d.getMonth(); // 0-based month
    const eDay = d.getDate();

    // Only include expenses that are exactly in the requested year and month
    if (eYear === year && eMonth === month) {
      acc[eDay] = (acc[eDay] || 0) + Number(e.amount || 0);
    }
    return acc;
  }, {});

  return days.map((day) => ({
    day: `Day ${day}`,
    amount: expenseMap[day] || 0,
  }));
}

// Custom Tooltip for Line Chart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-lg font-semibold text-indigo-600">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Bar Chart
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm font-semibold" style={{ color: entry.color }}>
            {`${entry.name}: ₹${entry.value.toLocaleString('en-IN')}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        <p className="text-sm font-semibold" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-lg text-gray-700">
          ₹{data.value.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-gray-500">
          {data.payload.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom Legend for Bar Chart
const CustomBarLegend = ({ payload }) => {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-sm" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Color palette for categories
const CATEGORY_COLORS = [
  '#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#64748b',
  '#a855f7', '#14b8a6', '#eab308', '#dc2626', '#6366f1'
];

// Individual Donut Chart Component
const CategoryDonutChart = ({ title, data, colors }) => {
  // Calculate total for center label
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
      <h2 className="text-md font-semibold text-gray-800 mb-3 text-center">
        {title}
      </h2>
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            
            {/* Center label with percentage */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold"
            >
              {data.length > 0 ? `${Math.round((data[0].value / total) * 100)}%` : '0%'}
            </text>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 w-full">
        <div className="grid grid-cols-1 gap-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-sm" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-600 truncate" title={item.name}>{item.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const router = useRouter();

  // Filter
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYYYYMM());

  // Totals / stats
  const [totalExpense, setTotalExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("N/A");
  const [income, setIncome] = useState(0);

  // Chart data
  const [expenseData, setExpenseData] = useState([]);
  const [monthlyComparison, setMonthlyComparison] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [categoryDonutData, setCategoryDonutData] = useState({});

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 80 },
    }),
  };

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchStats = useCallback(async (userId, yyyyMM) => {
    setLoading(true);
    setFetchError(null);
    const { startIso, endIso, year, month } = monthRange(yyyyMM);

    try {
      // -------- Expenses with categories
      let { data: expenses, error: expenseError } = await supabase
        .from("expenses")
        .select("id, amount, date, categories(name)")
        .eq("user_id", userId)
        .gte("date", startIso)
        .lte("date", endIso)
        .order("date", { ascending: true });

      if (expenseError) {
        console.error("Error fetching expenses:", expenseError);
        setFetchError("Failed to load expense data.");
        expenses = [];
      }

      const totalExp = (expenses || []).reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
      );
      setTotalExpense(totalExp);

      // Calculate category breakdown
      const categoryData = {};
      let categoryTotal = 0;

      for (const e of expenses || []) {
        const cat = e?.categories?.name || "Uncategorized";
        const amount = Number(e.amount || 0);
        categoryData[cat] = (categoryData[cat] || 0) + amount;
        categoryTotal += amount;
      }

      // Prepare data for pie chart
      const breakdownData = Object.entries(categoryData).map(([name, value], index) => ({
        name,
        value,
        percentage: categoryTotal > 0 ? Math.round((value / categoryTotal) * 100) : 0,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      }));

      setCategoryBreakdown(breakdownData);

      if (breakdownData.length > 0) {
        const top = breakdownData.sort((a, b) => b.value - a.value)[0]?.name;
        setTopCategory(top || "N/A");
      } else {
        setTopCategory("N/A");
      }

      // Prepare data for individual donut charts
      const donutData = {};
      for (const [category, amount] of Object.entries(categoryData)) {
        donutData[category] = [
          {
            name: category,
            value: amount,
            percentage: categoryTotal > 0 ? Math.round((amount / categoryTotal) * 100) : 0
          },
          {
            name: "Other Expenses",
            value: totalExp - amount,
            percentage: categoryTotal > 0 ? Math.round(((totalExp - amount) / categoryTotal) * 100) : 0
          }
        ];
      }
      
      setCategoryDonutData(donutData);

      // Fill missing days for line chart
      const dailyData = prepareChartData(expenses || [], year, month);
      setExpenseData(dailyData);

      // -------- Incomes
      let { data: incomes, error: incomeError } = await supabase
        .from("income")
        .select("id, amount, date")
        .eq("user_id", userId)
        .gte("date", startIso)
        .lte("date", endIso);

      if (incomeError) {
        console.error("Error fetching incomes:", incomeError);
        setFetchError(prev => prev ? `${prev} Failed to load income data.` : "Failed to load income data.");
        incomes = [];
      }

      const totalInc = (incomes || []).reduce(
        (sum, i) => sum + Number(i.amount || 0),
        0
      );
      setIncome(totalInc);

      // Income vs Expense dataset
      setMonthlyComparison([
        {
          name: monthLabel(yyyyMM),
          Income: totalInc,
          Expense: totalExp,
        },
      ]);
    } catch (err) {
      console.error("Unexpected error in fetchStats:", err);
      setFetchError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      await fetchStats(data.user.id, selectedMonth);
    };
    init();
  }, [router, selectedMonth, fetchStats]);

  const netBalance = useMemo(
    () => Number(income || 0) - Number(totalExpense || 0),
    [income, totalExpense]
  );

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <LoadingPage type="expense" />; // or "income" for income page
if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Expense Tracker <span className="text-indigo-600">Dashboard</span>
          </h1>

          {/* Month Filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="month-filter" className="text-sm font-medium text-gray-700">
              Filter by Month
            </label>
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              aria-label="Select month to filter data"
            />
          </div>
        </div>

        {/* Display any fetch errors */}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p>{fetchError} Please try refreshing the page.</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: "Total Income",
              value: formatCurrency(income),
              icon: <Wallet className="w-10 h-10" />,
              gradient: "from-green-500 to-emerald-600",
            },
            {
              title: "Total Expense",
              value: formatCurrency(totalExpense),
              icon: <TrendingUp className="w-10 h-10" />,
              gradient: "from-red-500 to-rose-600",
            },
            {
              title: "Net Balance",
              value: formatCurrency(netBalance),
              icon: <Scale className="w-10 h-10" />,
              gradient: netBalance >= 0 ? "from-purple-500 to-pink-600" : "from-amber-500 to-orange-600",
            },
            {
              title: "Top Category",
              value: topCategory,
              icon: <PieChart className="w-10 h-10" />,
              gradient: "from-blue-500 to-cyan-600",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-r ${card.gradient} text-white p-6 rounded-2xl shadow-lg flex items-center gap-4`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <div className="bg-white/20 p-3 rounded-full">{card.icon}</div>
              <div>
                <h2 className="text-lg">{card.title}</h2>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Modernized Line Chart */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Daily Expense Trend ({monthLabel(selectedMonth)})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={expenseData}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                {/* Faint horizontal grid lines only */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="#f3f4f6" 
                  horizontal={true}
                />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val}`}
                  width={60}
                  tickMargin={10}
                />
                <Tooltip 
                  content={<CustomLineTooltip />}
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '5 5' }} 
                />
                <Line
                  type="monotoneX"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ 
                    fill: "#4f46e5", 
                    strokeWidth: 2, 
                    stroke: '#fff', 
                    r: 4, 
                    style: { filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))' } 
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: '#fff', 
                    strokeWidth: 3, 
                    fill: '#4f46e5',
                    style: { filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))' } 
                  }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Modernized Bar Chart */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Income vs Expense ({monthLabel(selectedMonth)})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={monthlyComparison}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                barGap={10}
              >
                {/* Faint horizontal grid lines only */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  horizontal={false} 
                  stroke="#f3f4f6" 
                  vertical={true}
                />
                <XAxis 
                  type="number" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(val) => `₹${val}`}
                  tickMargin={10}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={100}
                  tickMargin={10}
                />
                <Tooltip 
                  content={<CustomBarTooltip />}
                  cursor={{ fill: '#f3f4f6', fillOpacity: 0.3 }}
                />
                <Legend content={<CustomBarLegend />} />
                <Bar
                  dataKey="Income"
                  fill="#16a34a"
                  radius={[0, 6, 6, 0]}
                  animationDuration={1200}
                  barSize={40}
                  background={{ fill: '#f9fafb', radius: 6 }}
                />
                <Bar
                  dataKey="Expense"
                  fill="#dc2626"
                  radius={[0, 6, 6, 0]}
                  animationDuration={1200}
                  barSize={40}
                  background={{ fill: '#f9fafb', radius: 6 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Section - Four donut charts per row */}
        {Object.keys(categoryDonutData).length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Expense Breakdown by Category
            </h2>
            
            {/* First row with 4 charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Object.entries(categoryDonutData)
                .slice(0, 4)
                .map(([category, data], index) => (
                  <CategoryDonutChart 
                    key={category}
                    title={category} 
                    data={data} 
                    colors={[CATEGORY_COLORS[index % CATEGORY_COLORS.length], '#e5e7eb']}
                  />
                ))}
            </div>
            
            {/* Second row with 4 charts */}
            {Object.keys(categoryDonutData).length > 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(categoryDonutData)
                  .slice(4, 8)
                  .map(([category, data], index) => (
                    <CategoryDonutChart 
                      key={category}
                      title={category} 
                      data={data} 
                      colors={[CATEGORY_COLORS[(index + 4) % CATEGORY_COLORS.length], '#e5e7eb']}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
