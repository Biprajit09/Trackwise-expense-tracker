"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function AddExpense() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get current logged in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      const { error: insertError } = await supabase.from("expenses").insert([
        {
          user_id: user.id,
          title,
          amount: parseFloat(amount),
          category,
          created_at: date ? new Date(date) : new Date(),
        },
      ]);

      if (insertError) throw insertError;

      // Redirect back to dashboard
      router.push("/");
    } catch (err) {
      console.error(err.message);
      setError("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Add New Expense</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. Grocery Shopping"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Amount</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Transport">🚌 Transport</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Bills">💡 Bills</option>
            <option value="Other">🔖 Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg shadow"
        >
          {loading ? "Adding..." : "+ Add Expense"}
        </button>
      </form>
    </div>
  );
}

