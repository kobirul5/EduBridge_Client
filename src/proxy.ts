import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, isPublicRoute, UserRole } from './lib/auth-utils';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const normalizeTokenRole = (role: unknown): UserRole | null => {
    if (role === "ADMIN") {
        return "ADMIN";
    }

    if (role === "USER") {
        return "USER";
    }

    return null;
}

const clearAuthCookies = (response: NextResponse) => {
    response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
    response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
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
    const isAuth = isAuthRoute(pathname)
    const isPublic = isPublicRoute(pathname)
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

            if (typeof verifiedToken.id === "string") {
                const userResponse = await fetch(`${BASE_URL}/users/${verifiedToken.id}`, {
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
            }
        } catch (error) {
            console.error("JWT Verification Error in proxy:", error);
            return redirectToLoginWithClearedAuth(request);
        }
    }

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

    // Logged-in users should not see auth routes.
    if (isAuth && userRole) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url))
    }

    // Rule 3 : User is trying to access common protected route
    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    // Rule 4 : User is trying to access role based protected route
    if (routerOwner === "ADMIN" || routerOwner === "USER") {
        if (userRole !== routerOwner) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url))
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
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|.*\\..*).*)',
    ],
}
