// app/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import TaskManager from '@/components/TaskManager';
import CategoryForm from '@/components/CategoryForm';
import CalendarView from '@/components/CalendarView';

type Section = 'tasks' | 'categories' | 'calendar';
interface CategoryInfo {
  id: string;
  name: string;
  color: string;
}

const TAB_MAP: Record<Section, string> = {
  tasks: 'สิ่งที่ต้องทำ',
  categories: 'หมวดหมู่',
  calendar: 'ปฏิทิน',
};

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('tasks');
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) router.replace('/auth/login');
    else setUserId(uid);
  }, [router]);

  const handleLogout = useCallback(async () => {
    if (!confirm('ออกจากระบบหรือไม่?')) return;
    await supabase.auth.signOut();
    localStorage.removeItem('userId');
    router.replace('/auth/login');
  }, [router]);

  if (!userId) {
    return <div className="flex items-center justify-center h-screen">กำลังดำเนินการ...</div>;
  }

  return (
    <>
      {/* Sidebar Toggle */}
      <button
        className={`toggle md:hidden ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen((v) => !v)}
      >
        ☰
      </button>

      {/* Drawer Overlay */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="logo mb-6">TODO</div>
        {(['tasks', 'categories', 'calendar'] as Section[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveSection(tab);
              setSelectedCategory(null);
              setDrawerOpen(false);
            }}
            className={`nav-button ${activeSection === tab ? 'active' : ''}`}
          >
            {TAB_MAP[tab]}
          </button>
        ))}
        <button
          onClick={() => {
            handleLogout();
            setDrawerOpen(false);
          }}
          className="logout-button mt-auto"
        >
          ออกจากระบบ
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeSection === 'tasks' && (
          <div className="w-full max-w-4xl">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                {selectedCategory ? `งานหมวด: ${selectedCategory.name}` : 'งานทั้งหมด'}
              </h1>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-gray-500 hover:underline"
                >
                  ดูทั้งหมด
                </button>
              )}
            </header>
            <TaskManager
              userId={userId}
              filterCategoryId={selectedCategory?.id || null}
              defaultCategory={selectedCategory}
            />
          </div>
        )}

        {activeSection === 'categories' && (
          <div className="w-full max-w-lg">
            <h1 className="text-2xl font-semibold mb-4">หมวดหมู่</h1>
            <CategoryForm
              userId={userId}
              onSelect={(id, name, color) => {
                setSelectedCategory({ id, name, color });
                setActiveSection('tasks');
              }}
            />
          </div>
        )}

        {activeSection === 'calendar' && (
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl font-semibold mb-4">ปฏิทิน</h1>
            <CalendarView />
          </div>
        )}
      </main>
    </>
  );
}
