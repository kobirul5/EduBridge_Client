/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const verifyRegisterOtp = async (
    _currentState: any,
    formData: FormData
): Promise<any> => {
    try {
        const email = formData.get("email") as string;
        const otpStr = formData.get("otp") as string;
        const role = formData.get("role") as string;

        if (!email || !otpStr) {
            return {
                success: false,
                message: "Email and OTP are required.",
            };
        }

        const otp = parseInt(otpStr, 10);
        if (isNaN(otp)) {
            return {
                success: false,
                message: "OTP must be a valid number.",
            };
        }

        const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: "POST",
            body: JSON.stringify({ email, otp }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Invalid OTP code. Please try again.",
            };
        }

        // OTP verification is successful!
        const token = result.data?.token;

        if (!token) {
            return {
                success: false,
                message: "Authentication token missing from response.",
            };
        }

        // Set the accessToken cookie on successful verification
        const cookieStore = await cookies();
        cookieStore.set("accessToken", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return {
            success: true,
            message: "Email verified successfully!",
            role,
        };

    } catch (error) {
        console.error("[verifyOtp] failed:", error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}
