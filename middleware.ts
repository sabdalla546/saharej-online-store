import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  publicRoutes,
  authRoutes,
  apiRoutePrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
const { auth } = NextAuth(authConfig);
export default auth((req) => {
  /*const isLoggedIn = !!req.auth;
  console.log("is logged in ", isLoggedIn);
  console.log("Route", req.nextUrl.pathname);*/
  // req.auth

  console.log("Route", req.nextUrl.pathname);
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log(isLoggedIn);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiRoutePrefix);
  const isPuplicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoute) {
    return;
  }
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (!isLoggedIn && !isPuplicRoutes) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  //console.log(isLoggedIn, isApiAuthRoute, isPuplicRoutes, isAuthRoutes);
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
