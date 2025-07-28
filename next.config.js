/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除了客户端环境变量暴露以确保安全
  // API密钥等敏感信息只在服务端使用
}

module.exports = nextConfig
