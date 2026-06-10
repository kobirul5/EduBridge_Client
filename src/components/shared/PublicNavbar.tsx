"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserCircle, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

const navItems = [
  { label: "Home", href: "/" },
  { label: "Request", href: "/request" },
  { label: "Booking", href: "/booking" },
  { label: "Massage AI", href: "/massage-ai" },
];

export default function Navbar({ user }: { user: NavbarUser }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-semibold text-primary">EduBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
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
                <Link
                  href="/admin/dashboard"
                  className="group flex items-center gap-3 rounded-full border border-border/70 bg-white/75 px-3 py-2 shadow-sm"
                >
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
                  <span className="hidden text-sm font-medium text-foreground sm:inline">
                    Dashboard
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full justify-between py-4">
                <div className="flex flex-col gap-4">
                  <Link href="/" className="flex items-center px-2">
                    <span className="text-lg font-semibold text-primary">EduBridge</span>
                  </Link>
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`text-sm font-medium transition-colors hover:text-primary rounded-md px-3 py-2 ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2 border-t pt-4">
                  {!user ? (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Join Now</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 rounded-lg border border-border/70 bg-white/75 px-3 py-2.5 shadow-sm"
                      >
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
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
                        <span className="text-sm font-medium text-foreground">
                          Dashboard
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
