import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "m.media-amazon.com",
      "www.bestbuy.com",
      "www.dyson.com",
      "store.hp.com",
      "i1.adis.ws",
      "i5.walmartimages.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
      "store.storeimages.cdn-apple.com",
    ],
  },
};

export default nextConfig;