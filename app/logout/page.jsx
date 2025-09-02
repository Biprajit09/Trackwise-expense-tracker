"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import LoadingPage from "../components/LoadingPage";

export default function Logout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        setLoading(false);
        router.push("/login");
      }
    };
    doLogout();
  }, [router]);

  if (loading) return <LoadingPage type="expense" />;

  return null;
}
