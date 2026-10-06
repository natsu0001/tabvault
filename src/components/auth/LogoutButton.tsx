
"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 border border-border px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <LogOut size={15} />
      Logout
    </button>
  );
}

