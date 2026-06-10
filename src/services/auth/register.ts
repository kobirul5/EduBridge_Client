/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import z from "zod";
import { cookies } from "next/headers";

// ── Base schema (shared by both roles) ─────────────────────────────────────
const baseSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    role: z.enum(["STUDENT", "TUTOR"], {
        error: () => ({ message: "Role must be STUDENT or TUTOR" }),
    }),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),

    // Personal Info
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(64, "Full name must be at most 64 characters"),
    phoneNumber: z.string().optional().or(z.literal("")),
    gender: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    about: z.string().optional().or(z.literal("")),
    education: z.string().optional().or(z.literal("")),
});

// ── Student schema ──────────────────────────────────────────────────────────
const studentSchema = baseSchema.refine(
    (data) => data.password === data.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
);

// ── Tutor schema (extends base with required tutor fields) ──────────────────
const tutorSchema = baseSchema
    .extend({
        hourlyRate: z
            .string()
            .min(1, "Hourly rate is required for tutors")
            .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
                message: "Hourly rate must be a positive number",
            }),
        experience: z.string().optional().or(z.literal("")),
        subject: z
            .string()
            .min(1, "At least one subject is required for tutors"),
        availableDays: z
            .string()
            .min(1, "Available days are required for tutors"),
        availableTime: z
            .string()
            .min(1, "Available time slots are required for tutors"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        const role = formData.get("role") as string;

        const rawData = {
            email: formData.get("email") as string,
            role,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
            fullName: formData.get("fullName") as string,
            phoneNumber: formData.get("phoneNumber") as string || "",
            gender: formData.get("gender") as string || "",
            city: formData.get("city") as string || "",
            about: formData.get("about") as string || "",
            education: formData.get("education") as string || "",
            // Tutor-only
            ...(role === "TUTOR" && {
                hourlyRate: formData.get("hourlyRate") as string || "",
                experience: formData.get("experience") as string || "",
                subject: formData.get("subject") as string || "",
                availableDays: formData.get("availableDays") as string || "",
                availableTime: formData.get("availableTime") as string || "",
            }),
        };

        // ── Validate with role-specific schema ──────────────────────────────
        const schema = role === "TUTOR" ? tutorSchema : studentSchema;
        const validated = schema.safeParse(rawData);

        if (!validated.success) {
            return {
                success: false,
                errors: validated.error.issues.map((issue) => ({
                    field: issue.path[0],
                    message: issue.message,
                })),
            };
        }

        // ── STEP 1: Core registration (email + password + role) ─────────────
        const res = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            body: JSON.stringify({
                email: rawData.email,
                password: rawData.password,
                role: rawData.role,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const result = await res.json();

        if (!result.success) {
            return { success: false, message: result.message || "Registration failed. Please try again." };
        }

        // Backend returns: { success: true, data: { newUser: {...}, token: "..." } }
        const token: string | undefined = result.data?.token;

        // ── STEP 2: Profile update with role-aware fields ───────────────────
        if (token) {
            const profilePayload: Record<string, any> = {};

            // Shared fields for both roles
            if (rawData.fullName)    profilePayload.fullName    = rawData.fullName;
            if (rawData.phoneNumber) profilePayload.phoneNumber = rawData.phoneNumber;
            if (rawData.gender)      profilePayload.gender      = rawData.gender;
            if (rawData.city)        profilePayload.city        = rawData.city;
            if (rawData.about)       profilePayload.about       = rawData.about;
            if (rawData.education)   profilePayload.education   = rawData.education;

            // Tutor-only fields
            if (role === "TUTOR") {
                const d = rawData as typeof rawData & {
                    hourlyRate: string;
                    experience: string;
                    subject: string;
                    availableDays: string;
                    availableTime: string;
                };

                if (d.hourlyRate) {
                    profilePayload.hourlyRate = parseFloat(d.hourlyRate);
                }
                if (d.experience) {
                    profilePayload.experience = parseInt(d.experience, 10);
                }
                if (d.subject) {
                    profilePayload.subject = d.subject
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
                if (d.availableDays) {
                    profilePayload.availableDays = d.availableDays
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
                if (d.availableTime) {
                    profilePayload.availableTime = d.availableTime
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                }
            }

            if (Object.keys(profilePayload).length > 0) {
                const updateFormData = new FormData();
                updateFormData.append("data", JSON.stringify(profilePayload));

                try {
                    const updateRes = await fetch(`${BASE_URL}/users/update-profile`, {
                        method: "PATCH",
                        body: updateFormData,
                        headers: { Authorization: token },
                    });
                    const updateResult = await updateRes.json();
                    console.log("[register] profile update:", updateResult);
                } catch (err) {
                    // Non-fatal — user is registered, just profile update failed
                    console.error("[register] profile update failed:", err);
                }
            }

        }

        return {
            success: true,
            needsOtpVerification: true,
            email: rawData.email,
            role: rawData.role,
        };

    } catch (error) {
        console.error("[register] failed:", error);
        return { success: false, message: "Internal server error. Please try again." };
    }
}
