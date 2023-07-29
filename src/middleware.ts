import { authMiddleware } from "@clerk/nextjs";
import { pathToRegexp } from "path-to-regexp";

export default authMiddleware({
  publicRoutes: ["/", pathToRegexp("/:name", [])]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
