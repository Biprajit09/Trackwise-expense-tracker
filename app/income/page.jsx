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
  Briefcase,
} from "lucide-react";

export default function IncomePage() {
  const [user, setUser] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [sources, setSources] = useState([]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [sourceId, setSourceId] = useState("");
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

  // ✅ Fetch income sources & incomes
  const fetchData = async (userId) => {
    let { data: sources } = await supabase.from("income_sources").select("*");
    setSources(sources || []);

    let { data: incomes } = await supabase
      .from("income")
      .select("*, income_sources(name)")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    setIncomes(incomes || []);
  };

  // ✅ Handle Add Income
  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("income").insert([
      {
        amount,
        date,
        source_id: sourceId,
        description,
        user_id: user.id,
      },
    ]);

    if (!error) {
      setAmount("");
      setDate("");
      setSourceId("");
      setDescription("");
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
                          bg-green-100 text-green-600 shadow-inner">
              <Briefcase size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="text-green-600">Income</span> Tracker
            </h1>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                       text-sm font-medium text-white shadow 
                       bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 
                       transform transition-transform duration-200 hover:scale-105"
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>
        </div>

        {/* 📋 Income Form */}
        <form
          onSubmit={handleAddIncome}
          className="bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 💰 Amount */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="text-green-500" />
                <span>Amount</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-green-400 
                           hover:border-green-400 transition duration-200"
              />
            </div>

            {/* 📅 Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="text-green-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-green-400 
                           hover:border-green-400 transition duration-200"
              />
            </div>

            {/* 🏷️ Income Source */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Briefcase size={16} className="text-green-500" />
                <span>Income Source</span>
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-green-400 
                           hover:border-green-400 transition duration-200"
              >
                <option value="">Select a source</option>
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 📝 Description */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={16} className="text-green-500" />
                <span>Description</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g. August Salary"
                className="w-full p-3 rounded-xl border border-gray-300 
                           bg-white shadow-sm text-gray-700 font-medium
                           focus:outline-none focus:ring-2 focus:ring-green-400 
                           hover:border-green-400 transition duration-200"
              />
            </div>
          </div>

          {/* ✅ Submit Button */}
          <button
            type="submit"
            className="mt-8 ml-auto flex items-center gap-2 px-6 py-3 
                       rounded-xl font-semibold text-white shadow-md 
                       bg-gradient-to-r from-green-500 to-green-600 
                       hover:from-green-600 hover:to-green-700 
                       transform transition-transform duration-200 hover:scale-105"
          >
            <PlusCircle size={18} /> Add Income
          </button>
        </form>

        {/* 📊 Income Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((inc, idx) => (
                <motion.tr
                  key={inc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(inc.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ₹{inc.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {inc.income_sources?.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{inc.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
