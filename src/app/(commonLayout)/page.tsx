import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[linear-gradient(180deg,var(--background)_0%,var(--secondary)_55%,var(--muted)_100%)] px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 rounded-[2.25rem] border border-border/70 bg-card/80 p-8 shadow-[0_24px_60px_-45px_color-mix(in_oklch,var(--primary)_45%,transparent)] backdrop-blur-md sm:p-12">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
            Welcome
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            EduBridge frontend trimmed to the essentials.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Use the login and registration flow to enter the app, or go straight to the dashboard if you are already authenticated.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-card px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
          >
            Registration
          </Link>
        </div>
      </div>
    </main>
  );
}
