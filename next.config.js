/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 允许在客户端访问的环境变量
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
  },
}

module.exports = nextConfig
