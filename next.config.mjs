/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Dev-only: allow cross-origin requests from ngrok tunnel ────────────
  // This value changes every time ngrok restarts (free plan).
  // UPDATE the hostname below to match your current ngrok URL before testing.
  allowedDevOrigins: ['bonnet-wildcat-hurler.ngrok-free.dev'],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Whitelist both 75 (default) and 100 (used by ClickableAvatar for founder photo)
    qualities: [75, 100],
  },


  // Server external packages (used in API routes)
  serverExternalPackages: ['mongoose', 'bcryptjs', 'jsonwebtoken', 'nodemailer'],

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
