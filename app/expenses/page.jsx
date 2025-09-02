"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import {
  Wallet,
  Calendar,
  FileText,
  DollarSign,
  PlusCircle,
  ArrowLeft,
  Tag,
} from "lucide-react";

export default function ExpensePage() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  // ✅ Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
      fetchData(data.user.id);
    };

    getUser();
  }, [router]);

  // ✅ Fetch categories & expenses for current user
  const fetchData = async (userId) => {
    let { data: categories } = await supabase.from("categories").select("*");
    setCategories(categories || []);

    let { data: expenses } = await supabase
      .from("expenses")
      .select("*, categories(name, description)")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    setExpenses(expenses || []);
  };

  // ✅ Handle Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("expenses").insert([
      {
        amount,
        date,
        category_id: categoryId,
        description,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setAmount("");
      setDate("");
      setCategoryId("");
      setDescription("");

      // Refresh table instantly
      fetchData(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">

       {/* Header with Back Button on Right */}
<div className="flex items-center justify-between mb-8">
  {/* Title */}
  <div className="flex items-center space-x-4 bg-white 
                px-4 py-3 rounded-xl shadow-sm border border-gray-100">
  <div className="flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-indigo-100 text-indigo-600 shadow-inner">
    <Wallet size={28} />
  </div>
  <h1 className="text-3xl font-bold text-gray-800">
    <span className="text-indigo-600">Expense</span> Tracker
  </h1>
</div>



  {/* Back Button */}
  <button
    onClick={() => router.push("/profile")}
    className="flex items-center gap-2 px-4 py-2 rounded-lg 
               text-sm font-medium text-white shadow 
               bg-gradient-to-r from-indigo-500 to-indigo-600 
               hover:from-indigo-600 hover:to-indigo-700 
               transform transition-transform duration-200 hover:scale-105"
  >
    <ArrowLeft size={16} /> Back to Profile
  </button>
</div>


        {/* 📋 Expense Form */}
        <form
          onSubmit={handleAddExpense}
          className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 💰 Amount */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="text-indigo-500" />
                <span>Amount</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 
                           hover:border-indigo-400 transition duration-200"
              />
            </div>

            {/* 📅 Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="text-indigo-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 
                           hover:border-indigo-400 transition duration-200"
              />
            </div>

            {/* 🏷️ Category */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="text-indigo-500" />
                <span>Category</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 
                           hover:border-indigo-400 transition duration-200"
              >
                <option value="" className="text-gray-400">
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="text-gray-700 font-medium"
                  >
                    {cat.name} — {cat.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 📝 Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="text-indigo-500" />
                <span>Description</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. Lunch with friends"
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 
                           hover:border-indigo-400 transition duration-200"
              />
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="mt-8 ml-auto flex items-center gap-2 px-6 py-3 
                       rounded-xl font-semibold text-white shadow-md 
                       bg-gradient-to-r from-indigo-500 to-indigo-600 
                       hover:from-indigo-600 hover:to-indigo-700 
                       transform transition-transform duration-200 hover:scale-105"
          >
            <PlusCircle size={18} /> Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
