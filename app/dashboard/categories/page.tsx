// app/dashboard/categories/page.tsx
"use client";
import { useEffect, useState } from "react";
import CategoryForm from "@/components/CategoryForm";
import { supabase } from "@/lib/supabaseClient";

export default function CategoriesPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(()=> {
    // no auth session system here — simplistic: try to fetch first user as dummy
    (async () => {
      // Example: if you do not have auth session, you could show login link
      // For demo we fetch first user in DB to act as current user
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const d = await res.json();
        setUserId(d?.user?.id ?? null);
      } else {
        setUserId(null);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h1>Categories</h1>
      <CategoryForm userId={userId} />
    </div>
  );
}
