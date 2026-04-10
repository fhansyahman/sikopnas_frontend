/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['sikopnas.web.id','192.168.1.13', 'localhost'],
  /* config options here */
 async rewrites() {
    return [
      {
        
        source: '/api/:path*',
        destination: 'https://sikopnas.web.id/api/:path*',
      },
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
