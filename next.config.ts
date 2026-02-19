import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axvlv40zoa.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
