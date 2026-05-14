/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xorpay.com",
        pathname: "/qr"
      }
    ]
  }
};

export default nextConfig;
