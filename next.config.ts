import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Usamos el comportamiento clásico de caché de App Router: las peticiones
  // externas se cachean con `next: { revalidate }` desde `src/lib/weather.ts`.
  cacheComponents: false,
  // `partialPrefetching` solo puede activarse junto con `cacheComponents`.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
