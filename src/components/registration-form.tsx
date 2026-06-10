/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useState } from "react";
import { registerUser } from "@/services/auth/register";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  LucideMail,
  LucidePhone,
  LucideMapPin,
  LucideLock,
  LucideLoader2,
  LucideArrowRight,
  LucideUser,
  LucideBookOpen,
  LucideBriefcase,
  LucideDollarSign,
  LucideClock,
  LucideCalendarDays,
  LucideInfo,
  LucideGraduationCap,
  LucideChevronDown,
  LucideCheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field wrapper
// ─────────────────────────────────────────────────────────────────────────────
function FormField({
  label,
  required,
  error,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  hint?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground/70 ml-0.5 flex items-center gap-1">
        {label}
        {required && <span className="text-primary">*</span>}
        {hint && (
          <span className="text-muted-foreground font-normal normal-case tracking-normal">
            — {hint}
          </span>
        )}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none"
          />
        )}
        {children}
      </div>
      {error && (
        <p className="text-destructive text-xs font-semibold ml-0.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Select wrapper
// ─────────────────────────────────────────────────────────────────────────────
function StyledSelect({
  name,
  defaultValue,
  value,
  onChange,
  disabled,
  withIcon,
  children,
}: {
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  withIcon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <select
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border/60 bg-card/60",
          "text-sm font-medium text-foreground/80 shadow-sm appearance-none cursor-pointer",
          "transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          withIcon ? "pl-10 pr-8" : "pl-3 pr-8",
        )}
      >
        {children}
      </select>
      <LucideChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section divider
// ─────────────────────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/15 text-primary shrink-0">
        <Icon size={11} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/70">
        {title}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}

const inputCls = "h-11 bg-card/60 border-border/60 rounded-xl font-medium text-sm pl-10 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all";

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams?.get("role") === "TUTOR" ? "TUTOR" : "STUDENT";

  const [role, setRole] = useState<"STUDENT" | "TUTOR">(defaultRole);
  const [state, formAction, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      if (state.needsOtpVerification) {
        toast.info("Verification required", {
          description: "An OTP has been sent to your email. Please verify to complete registration.",
        });
        router.push(`/verify-otp?email=${encodeURIComponent(state.email)}&role=${encodeURIComponent(state.role)}`);
      } else {
        toast.success("Registration successful!", {
          description: "Welcome to EduBridge!",
        });
        router.push(role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student");
      }
    } else if (state.errors && state.errors.length > 0) {
      const firstError = state.errors[0]?.message || "Please correct the errors in the form.";
      toast.error("Registration failed", {
        description: firstError,
      });
    } else if (state.message) {
      toast.error("Registration failed", {
        description: state.message,
      });
    } else {
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }, [state, role, router]);

  const err = (field: string) => {
    if (!state?.errors) return null;
    return state.errors.find((e: any) => e.field === field)?.message ?? null;
  };

  const isTutor = role === "TUTOR";

  return (
    <form action={formAction} className="space-y-5">


      {/* ── ROLE SELECTION ──────────────────────────────────────────────── */}
      <SectionTitle icon={LucideUser} title="I am a" />

      <div className="grid grid-cols-2 gap-3">
        {(["STUDENT", "TUTOR"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl border-2 text-sm font-bold transition-all duration-200",
              role === r
                ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {role === r && (
              <LucideCheckCircle size={14} className="absolute top-2 right-2 text-primary" />
            )}
            {r === "STUDENT" ? (
              <LucideGraduationCap size={22} />
            ) : (
              <LucideBriefcase size={22} />
            )}
            <span>{r === "STUDENT" ? "Student" : "Tutor"}</span>
            <span className="text-[10px] font-normal opacity-70">
              {r === "STUDENT" ? "I want to learn" : "I want to teach"}
            </span>
          </button>
        ))}
      </div>

      {/* Hidden input carries the selected role */}
      <input type="hidden" name="role" value={role} />

      {/* ── CREDENTIALS ─────────────────────────────────────────────────── */}
      <SectionTitle icon={LucideLock} title="Login Credentials" />

      <FormField label="Email Address" required icon={LucideMail} error={err("email")}>
        <Input name="email" type="email" placeholder="you@example.com" disabled={isPending} className={inputCls} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Password" required icon={LucideLock} error={err("password")}>
          <Input name="password" type="password" placeholder="Min 8 characters" disabled={isPending} className={inputCls} />
        </FormField>
        <FormField label="Confirm Password" required icon={LucideLock} error={err("confirmPassword")}>
          <Input name="confirmPassword" type="password" placeholder="Repeat password" disabled={isPending} className={inputCls} />
        </FormField>
      </div>

      {/* ── PERSONAL INFO ────────────────────────────────────────────────── */}
      <SectionTitle icon={LucideUser} title="Personal Info" />

      <FormField label="Full Name" required icon={LucideUser} error={err("fullName")}>
        <Input name="fullName" placeholder="e.g. Karim Hossain" disabled={isPending} className={inputCls} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Phone Number" icon={LucidePhone} error={err("phoneNumber")}>
          <Input name="phoneNumber" placeholder="+880 1700-000000" disabled={isPending} className={inputCls} />
        </FormField>
        <FormField label="Gender" icon={LucideUser} error={err("gender")}>
          <div className="relative">
            <LucideUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
            <StyledSelect name="gender" defaultValue="" disabled={isPending} withIcon>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </StyledSelect>
          </div>
        </FormField>
      </div>

      <FormField label="City / Location" icon={LucideMapPin} error={err("city")}>
        <Input name="city" placeholder="e.g. Dhaka, Bangladesh" disabled={isPending} className={inputCls} />
      </FormField>

      {/* ── BACKGROUND (both roles) ──────────────────────────────────────── */}
      <SectionTitle icon={LucideBookOpen} title="Background" />

      <FormField label="Education" icon={LucideGraduationCap} error={err("education")}>
        <Input
          name="education"
          placeholder={isTutor ? "e.g. BSc Physics, BUET" : "e.g. Class 10, DPS"}
          disabled={isPending}
          className={inputCls}
        />
      </FormField>

      <FormField
        label="About"
        icon={LucideInfo}
        hint={isTutor ? "visible to students on your profile" : "optional"}
        error={err("about")}
      >
        <Textarea
          name="about"
          placeholder={
            isTutor
              ? "Describe your teaching style, expertise and experience..."
              : "Tell us a bit about yourself (optional)..."
          }
          disabled={isPending}
          rows={3}
          className="bg-card/60 border-border/60 rounded-xl text-sm font-medium resize-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all px-3 pt-2.5"
        />
      </FormField>

      {/* ── TUTOR-ONLY SECTION ───────────────────────────────────────────── */}
      {isTutor && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <SectionTitle icon={LucideBriefcase} title="Tutor Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Hourly Rate (BDT)"
              required
              icon={LucideDollarSign}
              error={err("hourlyRate")}
            >
              <Input
                name="hourlyRate"
                type="number"
                placeholder="e.g. 500"
                min={1}
                disabled={isPending}
                className={inputCls}
              />
            </FormField>

            <FormField
              label="Experience (years)"
              icon={LucideBriefcase}
              error={err("experience")}
            >
              <Input
                name="experience"
                type="number"
                placeholder="e.g. 3"
                min={0}
                disabled={isPending}
                className={inputCls}
              />
            </FormField>
          </div>

          <FormField
            label="Subjects You Teach"
            required
            icon={LucideBookOpen}
            hint="comma-separated"
            error={err("subject")}
          >
            <Input
              name="subject"
              placeholder="e.g. Math, Physics, Chemistry"
              disabled={isPending}
              className={inputCls}
            />
          </FormField>

          <FormField
            label="Available Days"
            required
            icon={LucideCalendarDays}
            hint="comma-separated"
            error={err("availableDays")}
          >
            <Input
              name="availableDays"
              placeholder="e.g. Monday, Wednesday, Friday"
              disabled={isPending}
              className={inputCls}
            />
          </FormField>

          <FormField
            label="Available Time Slots"
            required
            icon={LucideClock}
            hint="comma-separated"
            error={err("availableTime")}
          >
            <Input
              name="availableTime"
              placeholder="e.g. 9am–11am, 3pm–5pm"
              disabled={isPending}
              className={inputCls}
            />
          </FormField>
        </div>
      )}

      {/* ── SUBMIT ──────────────────────────────────────────────────────── */}
      <div className="pt-1">
        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            "w-full h-12 font-black text-base rounded-2xl",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "shadow-lg shadow-primary/25 transition-all",
            "hover:scale-[1.02] active:scale-[0.98]",
            "disabled:opacity-60 disabled:hover:scale-100",
            "flex items-center justify-center gap-2 group",
          )}
        >
          {isPending ? (
            <>
              <LucideLoader2 className="animate-spin" size={18} />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>
                {isTutor ? "Register as Tutor" : "Register as Student"}
              </span>
              <LucideArrowRight
                className="transition-transform group-hover:translate-x-1"
                size={18}
              />
            </>
          )}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground mt-3">
          {isTutor
            ? "After registration, complete your tutor profile to start receiving bookings."
            : "After registration, browse available tutors and book your first session."}
        </p>
      </div>
    </form>
  );
}
