/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['103.87.66.92','192.168.1.13', 'localhost'],
  /* config options here */
 async rewrites() {
    return [
      {
        
        source: '/api/:path*',
        destination: 'http://103.87.66.92:5000/api/:path*',
      },
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
