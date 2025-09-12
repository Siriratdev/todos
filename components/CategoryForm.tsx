// components/CategoryForm.tsx
"use client";
import { useEffect, useState } from "react";

export default function CategoryForm({ userId }: { userId: string | null }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#0ea5e9");
  const [list, setList] = useState<any[]>([]);

  const fetchCats = async () => {
    if (!userId) return;
    const res = await fetch(`/api/categories?user_id=${userId}`);
    const data = await res.json();
    setList(data || []);
  };

  useEffect(() => { fetchCats(); }, [userId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("Login required");
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, name, color }),
    });
    setName("");
    fetchCats();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCats();
  };

  const edit = async (id: string) => {
    const newName = prompt("New name?");
    if (!newName) return;
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    fetchCats();
  };

  return (
    <div className="card">
      <h3>Categories</h3>

      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="category name" className="p-2 border" required />
        <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} />
        <button className="bg-green-600 text-white p-2 rounded">Add</button>
      </form>

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {list.map(c => (
          <li key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #eee" }}>
            <div>
              <span style={{ display: "inline-block", width: 12, height: 12, background: c.color, marginRight: 8, verticalAlign: "middle", borderRadius: 3 }} />
              {c.name}
            </div>
            <div>
              <button onClick={()=>edit(c.id)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={()=>remove(c.id)} style={{ color: "red" }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
