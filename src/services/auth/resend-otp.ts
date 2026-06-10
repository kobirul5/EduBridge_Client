/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const resendRegisterOtp = async (email: string): Promise<any> => {
    try {
        if (!email) {
            return {
                success: false,
                message: "Email is required.",
            };
        }

        const res = await fetch(`${BASE_URL}/auth/resend-otp`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to resend OTP. Please try again.",
            };
        }

        return {
            success: true,
            message: result.message || "OTP resent successfully!",
        };

    } catch (error) {
        console.error("[resendOtp] failed:", error);
        return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
        };
    }
}
