import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, isPublicRoute, UserRole } from './lib/auth-utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const normalizeTokenRole = (role: unknown): UserRole | null => {
    if (role === "ADMIN" || role === "STUDENT" || role === "TUTOR") {
        return role as UserRole;
    }
    return null;
};

const clearAuthCookies = (response: NextResponse) => {
    response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
    return response;
};

const redirectToLoginWithClearedAuth = (request: NextRequest) => {
    return clearAuthCookies(NextResponse.redirect(new URL("/login", request.url)));
};

const isUserNotFoundResponse = async (response: Response) => {
    if (response.status !== 404) {
        return false;
    }
    try {
        const payload = await response.json();
        return typeof payload?.message === "string" && payload.message.toLowerCase().includes("user not found");
    } catch {
        return true;
    }
};


export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isAuth = isAuthRoute(pathname);
    const isPublic = isPublicRoute(pathname);
    const routerOwner = getRouteOwner(pathname);

    if (isPublic) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get("accessToken")?.value || null;

    let userRole: UserRole | null = null;

    if (accessToken) {
        try {
            const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_SECRET as string);

            if (typeof verifiedToken === "string") {
                return redirectToLoginWithClearedAuth(request);
            }

            userRole = normalizeTokenRole(verifiedToken.role);

            if (!userRole) {
                return redirectToLoginWithClearedAuth(request);
            }

            // Optional: validate user still exists in DB and check emailVerified
            if (typeof verifiedToken.id === "string") {
                const userResponse = await fetch(`${BASE_URL}/users/get-me`, {
                    method: "GET",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });

                if (userResponse.status === 401 || (await isUserNotFoundResponse(userResponse.clone()))) {
                    return redirectToLoginWithClearedAuth(request);
                }

                try {
                    const profileRes = await userResponse.json();
                    if (profileRes?.data && profileRes.data.emailVerified === false) {
                        const verifyUrl = new URL("/verify-otp", request.url);
                        verifyUrl.searchParams.set("email", profileRes.data.email || "");
                        verifyUrl.searchParams.set("role", profileRes.data.role || "");
                        return NextResponse.redirect(verifyUrl);
                    }
                } catch (err) {
                    console.error("Error reading profile in proxy:", err);
                }
            }
        } catch (error) {
            console.error("JWT Verification Error in proxy:", error);
            return redirectToLoginWithClearedAuth(request);
        }
    }

    // No token → allow auth pages, redirect others to login
    if (!accessToken) {
        if (isAuth) {
            return NextResponse.next();
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (!userRole) {
        return redirectToLoginWithClearedAuth(request);
    }

    // Logged-in users should not see auth routes
    if (isAuth && userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
    }

    // Common protected route (any authenticated user)
    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    // Role-based protected route
    if (routerOwner === "ADMIN") {
        if (userRole !== "ADMIN") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        }
    }

    if (routerOwner === "USER") {
        if (userRole !== "STUDENT" && userRole !== "TUTOR") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - public assets with file extensions
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|.*\\..*).*)' ,
    ],
}
