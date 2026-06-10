"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

type AdminSidebarUser = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profileImage?: string | null;
  role?: string | null;
};

export default function AdminDashboardSidebar({ user }: { user?: AdminSidebarUser | null }) {
  const pathname = usePathname();
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "Admin User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = user?.role || "Admin";

  return (
    <aside className="sticky top-0 h-screen border-r border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,240,231,0.96))] px-5 py-6 shadow-[18px_0_45px_-40px_rgba(95,76,55,0.35)]">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 rounded-[1.75rem] bg-white/85  ">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.35rem] bg-white shadow-[inset_0_0_0_1px_rgba(95,76,55,0.08)]">
            <Image
              src="/assets/logo.png"
              alt="EduBridge logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
              Admin Panel
            </p>
            <h1 className="mt-1 text-lg font-semibold text-foreground">EduBridge</h1>
          </div>
        </div>

        <nav className="mt-8 min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Overview
            </p>
            <div className="mt-3 space-y-1.5">
              <Link
                href="/admin/dashboard"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  pathname === "/admin/dashboard"
                    ? "bg-primary text-primary-foreground shadow-[0_18px_35px_-25px_rgba(109,87,67,0.55)]"
                    : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="mt-4 rounded-[1.55rem]  shadow-[0_18px_45px_-35px_rgba(95,76,55,0.28)]">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[linear-gradient(135deg,#ead8c2,#c7a783)]">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary" >
                  {userInitial}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || "No email found"}</p>
            </div>
          </div>

          <div className="mt-3 inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {userRole}
          </div>
        </div>
      </div>
    </aside>
  );
}
