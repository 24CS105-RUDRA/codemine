"use client";

import { useState } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import MobileNav from "@/components/navigation/MobileNav";
import TopBar from "@/components/navigation/TopBar";
import CommandPalette from "@/components/navigation/CommandPalette";
import FloatingAI from "@/components/ai/FloatingAI";
import NotificationsPanel from "@/components/navigation/NotificationsPanel";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface-secondary)]">
      <Sidebar />
      <MobileNav />
      <main className="lg:ml-[256px] min-h-screen">
        <TopBar onSearchOpen={() => setSearchOpen(true)} onNotificationsOpen={() => setNotifOpen(true)} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-8">
          {children}
        </div>
      </main>
      <FloatingAI />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
