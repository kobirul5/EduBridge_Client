export type UserRole = "ADMIN" | "STUDENT" | "TUTOR";

// exact : ["/my-profile", "settings"]
//   patterns: [/^\/dashboard/, /^\/user/], // Routes starting with /dashboard/* /user/*
export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = [
    "/login",
    "/register",
    "/verify-otp",
];

export const publicRoutes = [
    "/",
];

export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/profile"],
    patterns: [],
}

export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/admin/], // Routes starting with /admin/*
    exact: [], // "/admins"
}

export const userProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard/], // Routes starting with /dashboard/*
    exact: [], // "/dashboard"
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

export const isPublicRoute = (pathname: string) => {
    return publicRoutes.some((route: string) => route === pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
    // if pathname === /dashboard/my-appointments => matches /^\/dashboard/ => true
}

export const getRouteOwner = (pathname: string): "ADMIN" | "USER" | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }
    if (isRouteMatches(pathname, userProtectedRoutes)) {
        return "USER";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") {
        return "/admin/dashboard";
    }
    if (role === "STUDENT") {
        return "/dashboard/student";
    }
    if (role === "TUTOR") {
        return "/dashboard/tutor";
    }
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}
