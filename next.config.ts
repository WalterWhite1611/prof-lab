const isProd = process.env.NODE_ENV === "production";
const repo = "prof-lab"; // <-- your repo name

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,

  // skip lint/type in CI builds; optional but keeps deploys smooth
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
