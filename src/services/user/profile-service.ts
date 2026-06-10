/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Uses the accessToken cookie to fetch the current user's profile from /users/get-me
export const getProfile = async (_userId?: string, options?: { revalidate?: number }): Promise<any> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const revalidate = options?.revalidate ?? 60;

    if (!accessToken) return null;

    try {
        const res = await fetch(`${BASE_URL}/users/get-me`, {
            method: "GET",
            headers: {
                "Authorization": accessToken,
                "Content-Type": "application/json",
            },
            next: { revalidate },
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `HTTP ${res.status}`);
        }

        const result = await res.json();
        return result.data ?? null;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}
