import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT use 'export' - it disables API Routes entirely
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
