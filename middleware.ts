import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
    DEFAULT_REDIRECT_URL,
    authroutes,
    publicroutes,
    apiauthprefixes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiauthprefixes);
    const isAuthRoute = authroutes.includes(nextUrl.pathname);
    const isPublicRoute = publicroutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_REDIRECT_URL, nextUrl));
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth-sign-in", nextUrl));
    }
    return null;
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
