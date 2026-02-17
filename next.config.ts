import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  allowedDevOrigins: ["https://1533-2401-4900-1c82-f075-b531-f465-33c8-c464.ngrok-free.app"],

  /* config options here */
};

export default nextConfig;
