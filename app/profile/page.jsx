"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import LoadingPage from "../components/LoadingPage";

// Lucide icons
import {
  AlertCircle,
  ShoppingBag,
  Utensils,
  Lightbulb,
  Plane,
  Film,
  HeartPulse,
  ShoppingCart,
  Wallet,
  PieChart,
  PlusCircle,
  LogOut,
  TrendingUp,
  Scale,
} from "lucide-react";

/** Helpers */
function currentMonthYYYYMM() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}`;
}

function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthRange(yyyyMM) {
  // yyyyMM like "2025-08"
  const [y, m] = yyyyMM.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0); // last day of month
  const startIso = formatDateLocal(start); // ✅ Local-safe
  const endIso = formatDateLocal(end);     // ✅ Local-safe
  return { startIso, endIso };
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Filter
  const [selectedMonth, setSelectedMonth] = useState(currentMonthYYYYMM());

  // Totals / stats
  const [totalExpense, setTotalExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("N/A");
  const [income, setIncome] = useState(0);

  // Lists
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);

  // Tips
  const [suggestion, setSuggestion] = useState(null);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 80 },
    }),
  };

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      await fetchStats(data.user.id, selectedMonth);
      setLoading(false);
    };
    init();
  }, [router, selectedMonth]);

  async function fetchStats(userId, yyyyMM) {
    const { startIso, endIso } = monthRange(yyyyMM);

    // -------- Expenses (with categories)
    let { data: expenses, error: expenseError } = await supabase
      .from("expenses")
      .select("id, amount, description, date, categories(name)")
      .eq("user_id", userId)
      .gte("date", startIso)
      .lte("date", endIso)
      .order("date", { ascending: false });

    if (expenseError) {
      console.error(
        "Error fetching expenses:",
        expenseError?.message || JSON.stringify(expenseError)
      );
      expenses = [];
    }

    // Totals & top category
    const totalExp = (expenses || []).reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );
    setTotalExpense(totalExp);

    if ((expenses || []).length > 0) {
      const byCat = {};
      for (const e of expenses) {
        const cat = e?.categories?.name || "Uncategorized";
        byCat[cat] = (byCat[cat] || 0) + Number(e.amount || 0);
      }
      const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0];
      setTopCategory(top || "N/A");
      setSuggestion(generateSuggestion(top));
    } else {
      setTopCategory("N/A");
      setSuggestion(null);
    }

    setRecentExpenses((expenses || []).slice(0, 3));

    // -------- Incomes (with income_sources)
    let { data: incomes, error: incomeError } = await supabase
      .from("income")
      .select("id, amount, description, date, income_sources(name)")
      .eq("user_id", userId)
      .gte("date", startIso)
      .lte("date", endIso)
      .order("date", { ascending: false });

    if (incomeError) {
      console.error(
        "Error fetching incomes:",
        incomeError?.message || JSON.stringify(incomeError)
      );
      incomes = [];
    }

    const totalInc = (incomes || []).reduce(
      (sum, i) => sum + Number(i.amount || 0),
      0
    );
    setIncome(totalInc);
    setRecentIncomes((incomes || []).slice(0, 3));
  }

  // Rule-based + enhanced suggestion system
  function generateSuggestion(category, topAmount, totalExp, income) {
    const net = Number(income || 0) - Number(totalExp || 0);

    // % of total expenses taken by the top category
    const categoryPct =
      totalExp > 0 && topAmount > 0
        ? Math.round((Number(topAmount) / Number(totalExp)) * 100)
        : null;

    const tips = [
      "Small savings add up to big wins!",
      "A budget is telling your money where to go.",
      "Track every rupee — it gives you control.",
      "Cutting 1 coffee a day = saving ₹1000+ a month!",
      "Consistency beats intensity in savings.",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    if (!category || totalExp <= 0) {
      return {
        icon: <AlertCircle className="w-6 h-6 text-gray-500" />,
        text: "Start adding expenses to get personalized insights!",
        percentage: null,
        bg: "bg-gray-50 border-gray-400",
        extra: randomTip,
      };
    }

    if (net < 0) {
      return {
        icon: <TrendingUp className="w-6 h-6 text-red-500" />,
        text: "Your expenses are higher than your income — time to review spending.",
        percentage: categoryPct,
        bg: "bg-red-50 border-red-400",
        extra: randomTip,
      };
    }

    const cat = String(category).toLowerCase();

    if (cat.includes("food"))
      return {
        icon: <Utensils className="w-6 h-6 text-orange-500" />,
        text: "Food is your biggest expense — try cooking at home a few more times!",
        percentage: categoryPct,
        bg: "bg-orange-50 border-orange-400",
        extra: randomTip,
      };

    if (cat.includes("grocer"))
      return {
        icon: <ShoppingCart className="w-6 h-6 text-green-500" />,
        text: "Groceries are important, but buying in bulk could save money.",
        percentage: categoryPct,
        bg: "bg-green-50 border-green-400",
        extra: randomTip,
      };

    if (cat.includes("bills") || cat.includes("electricity"))
      return {
        icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
        text: "Bills top your spending — consider energy-efficient options.",
        percentage: categoryPct,
        bg: "bg-yellow-50 border-yellow-400",
        extra: randomTip,
      };

    if (cat.includes("shopping"))
      return {
        icon: <ShoppingBag className="w-6 h-6 text-pink-500" />,
        text: "Shopping leads — set a monthly cap to stay on track.",
        percentage: categoryPct,
        bg: "bg-pink-50 border-pink-400",
        extra: randomTip,
      };

    if (cat.includes("travel") || cat.includes("transport"))
      return {
        icon: <Plane className="w-6 h-6 text-blue-500" />,
        text: "Travel is big — booking early can reduce costs.",
        percentage: categoryPct,
        bg: "bg-blue-50 border-blue-400",
        extra: randomTip,
      };

    if (cat.includes("entertainment"))
      return {
        icon: <Film className="w-6 h-6 text-purple-500" />,
        text: "Entertainment leads — try a home movie night to save.",
        percentage: categoryPct,
        bg: "bg-purple-50 border-purple-400",
        extra: randomTip,
      };

    if (cat.includes("health"))
      return {
        icon: <HeartPulse className="w-6 h-6 text-red-500" />,
        text: "Health is top — a worthwhile long-term investment.",
        percentage: categoryPct,
        bg: "bg-red-50 border-red-400",
        extra: randomTip,
      };

    return {
      icon: <Lightbulb className="w-6 h-6 text-indigo-500" />,
      text: `Most of your money goes to ${category}. Review this area for savings!`,
      percentage: categoryPct,
      bg: "bg-indigo-50 border-indigo-400",
      extra: randomTip,
    };
  }

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.user_metadata?.display_name || user.email.split("@")[0];
  }, [user]);

  const netBalance = useMemo(
    () => Number(income || 0) - Number(totalExpense || 0),
    [income, totalExpense]
  );

   if (loading) return <LoadingPage type="expense" />; // or "income" for income page
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, <span className="text-indigo-600">{displayName}</span> 👋
        </h1>

        {/* Month Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Filter by Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border rounded-lg bg-white"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Income",
            value: `₹${income}`,
            icon: <Wallet className="w-10 h-10" />,
            gradient: "from-green-500 to-emerald-600",
          },
          {
            title: "Total Expense",
            value: `₹${totalExpense}`,
            icon: <TrendingUp className="w-10 h-10" />,
            gradient: "from-red-500 to-rose-600",
          },
          {
            title: "Net Balance",
            value: `₹${netBalance}`,
            icon: <Scale className="w-10 h-10" />,
            gradient: "from-purple-500 to-pink-600",
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

      {/* AI Suggestion */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-2xl shadow-md mb-8 flex items-start gap-3"
        >
          {suggestion.icon}
          <p className="text-gray-800 font-medium">{suggestion.text}</p>
        </motion.div>
      )}

      {/* Last 3 Expenses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold mb-4">Last 3 Expenses</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses in this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 rounded-tl-xl">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 rounded-tr-xl">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((exp, idx) => (
                  <motion.tr
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{exp.description}</td>
                    <td className="p-3 text-gray-600">
                      {exp.categories?.name || "Uncategorized"}
                    </td>
                    <td className="p-3 text-indigo-600 font-semibold">
                      ₹{exp.amount}
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Last 3 Incomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Last 3 Incomes</h2>
        {recentIncomes.length === 0 ? (
          <p className="text-gray-500">No incomes in this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 rounded-tl-xl">Description</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 rounded-tr-xl">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentIncomes.map((inc, idx) => (
                  <motion.tr
                    key={inc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{inc.description}</td>
                    <td className="p-3 text-gray-600">
                      {inc.income_sources?.name || "Other"}
                    </td>
                    <td className="p-3 text-green-600 font-semibold">
                      ₹{inc.amount}
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Actions */}
<div className="flex justify-between items-center w-full">
  {/* Left side buttons */}
  <div className="flex gap-4">
    <Link
      href="/expenses"
      className="flex items-center gap-2 rounded-lg px-4 py-2 
                 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white 
                 shadow hover:from-indigo-600 hover:to-indigo-700 
                 transform transition-transform duration-200 hover:scale-105"
    >
      <PlusCircle className="w-4 h-4" />
      Add Expense
    </Link>

    <Link
      href="/income"
      className="flex items-center gap-2 rounded-lg px-4 py-2 
                 bg-gradient-to-r from-green-500 to-green-600 text-white 
                 shadow hover:from-green-600 hover:to-green-700 
                 transform transition-transform duration-200 hover:scale-105"
    >
      <PlusCircle className="w-4 h-4" />
      Add Income
    </Link>
  </div>

  {/* Right side logout */}
  <Link
    href="/logout"
    className="flex items-center gap-2 rounded-lg px-4 py-2 
               bg-gradient-to-r from-red-500 to-red-600 text-white 
               shadow hover:from-red-600 hover:to-red-700 
               transform transition-transform duration-200 hover:scale-105"
  >
    <LogOut className="w-4 h-4" />
    Logout
  </Link>
</div>

    </div>
  );
}