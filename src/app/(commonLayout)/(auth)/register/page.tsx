"use client";

import RegistrationForm from "@/components/registration-form";
import Link from "next/link";
import { LucideArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LOTTIE_URL = "/Login.json";

export default function RegisterPage() {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Lottie fetch error:", err));
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--background),var(--secondary))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden border border-border/70 bg-card/70 shadow-[0_24px_70px_-48px_color-mix(in_oklch,var(--primary)_45%,transparent)] backdrop-blur lg:grid-cols-[0.92fr_1.08fr]">
        <section className="hidden min-h-[720px] flex-col justify-between border-r border-border/70 bg-secondary/30 p-10 lg:flex">
          <div className="max-w-md space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              EduBridge
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Create a profile built for steady progress.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Set up your account once, then move between learning, users, and dashboard tools without friction.
            </p>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center">
            <div className="absolute inset-x-10 bottom-4 h-24 bg-primary/10 blur-3xl" />
            <div className="relative h-[360px] w-full">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="border border-border/70 bg-card/70 p-5">
            <p className="text-sm font-semibold">One account, clear access</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your profile information stays aligned with the dashboard and protected routes.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-2xl space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">Get started</p>
              <h2 className="text-3xl font-semibold tracking-tight">Create your account</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Add the basics now. You can refine the rest later.
              </p>
            </div>

            <RegistrationForm />

            <div className="border-t border-border/70 pt-6 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  Sign in
                  <LucideArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
