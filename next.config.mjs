/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.18.19','192.168.1.13', 'localhost'],
  /* config options here */
 async rewrites() {
    return [
      {
        
        source: '/api/:path*',
        destination: 'http://192.168.18.19:5000/api/:path*',
      },
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
