// app/routes.ts

export type AppRoutes =
  | "/"                         // root tab index
  | "/(tabs)/Sidebar"
  | `/issueDetails/${string}`    // dynamic route
  | "/signin"
  | "/(auth)/signin";
