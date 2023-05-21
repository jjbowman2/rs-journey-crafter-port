import { authMiddleware } from "@clerk/nextjs";

const publicRoutes = ["/welcome"];

export default authMiddleware({ publicRoutes });

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
