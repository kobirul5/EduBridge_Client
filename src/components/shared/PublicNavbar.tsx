"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

export default function Navbar({ user }: { user: NavbarUser }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="EduBridge Logo" width={100} height={40} className="h-10 w-auto" />
          <span className="text-lg font-semibold text-primary">EduBridge</span>
        </Link>
        </div>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href="/admin/dashboard" className="group flex items-center gap-3 rounded-full border border-border/70 bg-white/75 px-3 py-2 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 transition-all group-hover:border-primary group-hover:bg-primary/5">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:inline">Dashboard</span>
            </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
