"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyRegisterOtp } from "@/services/auth/verify-otp";
import { resendRegisterOtp } from "@/services/auth/resend-otp";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideArrowLeft, LucideShieldCheck, LucideLoader2, LucideRotateCw } from "lucide-react";
import Link from "next/link";

interface VerifyOtpClientProps {
  email: string;
  role: string;
}

export default function VerifyOtpClient({ email, role }: VerifyOtpClientProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const [state, formAction, isPending] = useActionState(verifyRegisterOtp, null);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success("Verification successful!", {
        description: "Welcome to EduBridge!",
      });
      // Redirect to correct dashboard based on role
      router.push(state.role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student");
    } else {
      toast.error("Verification failed", {
        description: state.message || "Invalid OTP code.",
      });
    }
  }, [state, router]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!/^\d{4}$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    inputRefs.current[3]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    try {
      const result = await resendRegisterOtp(email);
      if (result.success) {
        toast.success("OTP resent successfully!", {
          description: "Please check your inbox for a new code.",
        });
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        toast.error("Failed to resend OTP", {
          description: result.message,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setResending(false);
    }
  };

  const combinedOtp = otp.join("");
  const isSubmitDisabled = combinedOtp.length < 4 || isPending;

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

      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <LucideArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
          Back to registration
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-[0_24px_80px_-20px_color-mix(in_oklch,var(--primary)_20%,transparent)]">
          {/* Card header */}
          <div className="px-7 pt-7 pb-5 border-b border-border/50 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 text-primary">
                <LucideShieldCheck size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
            <p className="text-sm text-muted-foreground mt-2">
              We sent a 4-digit code to <span className="font-semibold text-foreground/90">{email}</span>.
            </p>
          </div>

          {/* Form */}
          <div className="px-7 py-6">
            <form action={formAction} className="space-y-6">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="otp" value={combinedOtp} />

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/70 flex justify-center uppercase tracking-wider mb-2">
                  Verification Code
                </label>
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      disabled={isPending}
                      className={cn(
                        "w-12 h-14 text-center text-xl font-extrabold rounded-xl border bg-card/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
                        digit ? "border-primary text-primary" : "border-border/60 text-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className={cn(
                  "w-full h-11 font-black text-sm rounded-xl transition-all",
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "shadow-lg shadow-primary/20 hover:shadow-primary/30",
                  "active:scale-[0.98]",
                  "disabled:opacity-60 disabled:hover:shadow-none disabled:active:scale-100"
                )}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <LucideLoader2 size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </span>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>

            {/* Resend Actions */}
            <div className="mt-6 text-center text-sm">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline underline-offset-4 transition-colors"
                >
                  {resending ? (
                    <LucideLoader2 size={13} className="animate-spin" />
                  ) : (
                    <LucideRotateCw size={13} />
                  )}
                  <span>Resend Verification Code</span>
                </button>
              ) : (
                <p className="text-muted-foreground">
                  Resend code in{" "}
                  <span className="font-bold text-foreground/80">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Card footer */}
          <div className="px-7 py-5 border-t border-border/50 bg-muted/20 rounded-b-2xl text-center">
            <p className="text-sm text-muted-foreground">
              Not your email?{" "}
              <Link
                href="/register"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                Change email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
