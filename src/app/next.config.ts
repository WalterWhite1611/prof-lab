// next.config.ts
const isProd = process.env.NODE_ENV === "production";
const repo = "prof-lab"; // <-- replace with your GitHub repository name

const nextConfig = {
  output: "export",           // enable static export
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
