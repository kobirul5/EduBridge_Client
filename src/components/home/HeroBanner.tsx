import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Star, Video, BookOpen } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background)_0%,var(--secondary)_50%,var(--muted)_100%)] py-20 md:py-28">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Left Column: Content */}
          <div className="flex flex-col items-start space-y-6 lg:col-span-7">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Online Tuition Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.15]">
              Find the Perfect <span className="text-primary bg-linear-to-r from-primary to-chart-2 bg-clip-text">Online Tutor</span> For Your Journey
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              EduBridge connects passionate educators with ambitious students. Get personalized 1-on-1 tutoring, learn live from any device, and master any subject from the comfort of your home.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
              <Button size="lg" asChild className="rounded-full px-8 py-6 text-base font-semibold shadow-md transition-transform hover:-translate-y-0.5">
                <Link href="/booking">
                  Find a Tutor
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 py-6 text-base font-semibold transition-transform hover:-translate-y-0.5">
                <Link href="/register">
                  Become a Tutor
                  <GraduationCap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 border-t border-border/70 pt-8 w-full">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-xl font-bold text-foreground sm:text-2xl">500+</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Expert Tutors</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="text-xl font-bold text-foreground sm:text-2xl">10k+</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Students</span>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="text-xl font-bold text-foreground sm:text-2xl">4.9/5</span>
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image & Decorative Visuals */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-112.5 aspect-square rounded-3xl border border-border/50 bg-card/50 p-4 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-2xl w-full h-full relative">
                <Image
                  src="/tutor_hero_illustration.png"
                  alt="Online Tutoring Illustration"
                  fill
                  sizes="(max-w-768px) 100vw, 450px"
                  className="object-cover transition-transform hover:scale-105 duration-700"
                  priority
                />
              </div>

              {/* Floating features badge 1 */}
              <div className="absolute -top-4 -left-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-card/90 p-3 shadow-lg backdrop-blur-md animate-bounce duration-1000">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Live 1-on-1 Classes</p>
                  <p className="text-[10px] text-muted-foreground">Interactive Virtual Classroom</p>
                </div>
              </div>

              {/* Floating features badge 2 */}
              <div className="absolute -bottom-4 -right-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-card/90 p-3 shadow-lg backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Star className="h-5 w-5 fill-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Verified Tutors Only</p>
                  <p className="text-[10px] text-muted-foreground">Top standard screening</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
