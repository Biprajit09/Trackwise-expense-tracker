"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");

      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      setCategories(data || []);
    };
    fetchCategories();
  }, [router]);

  const addCategory = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("categories").insert([{ user_id: user.id, name: newCategory }]);
    setNewCategory("");
    router.refresh();
  };

  const deleteCategory = async (id) => {
    await supabase.from("categories").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Categories</h1>
      <form onSubmit={addCategory} className="flex mb-4">
        <input type="text" placeholder="New Category" value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)} className="border p-2 rounded-l w-full" required />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded-r">Add</button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c.id} className="flex justify-between border-b py-2">
            {c.name}
            <button onClick={() => deleteCategory(c.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
