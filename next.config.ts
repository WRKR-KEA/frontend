import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 검사 비활성화
  },
  typescript: {
    ignoreBuildErrors: true, // 타입스크립트 오류 무시
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: "http://localhost:8080/api/:path*", // 백엔드 서버 주소
//       },
//     ];
//   },
// };

// module.exports = nextConfig;