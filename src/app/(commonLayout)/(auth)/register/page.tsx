import RegistrationForm from "@/components/registration-form";
import Link from "next/link";
import { Suspense } from "react";
import { LucideArrowLeft, LucideSparkles } from "lucide-react";

export const metadata = {
  title: "Create Account — EduBridge",
  description: "Join EduBridge as a student or tutor and start your learning journey today.",
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4 py-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="w-full max-w-xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <LucideArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-[0_24px_80px_-20px_color-mix(in_oklch,var(--primary)_20%,transparent)]">
          {/* Card header */}
          <div className="px-7 pt-7 pb-5 border-b border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/15">
                <LucideSparkles size={15} className="text-primary" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">
                EduBridge
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Join as a student to find tutors, or as a tutor to teach online.
            </p>
          </div>

          {/* Form */}
          <div className="px-7 py-6">
            <Suspense fallback={<div className="h-48 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /></div>}>
              <RegistrationForm />
            </Suspense>
          </div>

          {/* Card footer */}
          <div className="px-7 py-5 border-t border-border/50 bg-muted/20 rounded-b-2xl">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground/60">
          <span>🔒 Secure registration</span>
          <span>·</span>
          <span>✅ Free to join</span>
          <span>·</span>
          <span>🎓 1000+ tutors</span>
        </div>
      </div>
    </main>
  );
}
