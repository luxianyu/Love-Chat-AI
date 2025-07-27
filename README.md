# 💕 Love Chat AI - 恋爱聊天神器

> 让每句话都说到心坎里 ❤️

一个基于 Deepseek 大模型的智能恋爱聊天助手，帮您生成温馨、浪漫、贴心的聊天回复。支持多种聊天风格和关系阶段，让您的每一句话都充满魅力！

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC)

## ✨ 功能特色

### 🎯 智能回复生成
- **多风格回复**：每次生成3条不同风格的聊天回复
- **关系阶段识别**：从初识到灵魂伴侣，10个不同的关系阶段
- **性别适配**：支持男生和女生两种不同的聊天风格
- **实时打字效果**：仿真打字动画，提升用户体验

### 💝 个性化配置
- **关系阶段滑块**：直观调节当前关系的亲密程度
- **聊天风格选择**：浪漫、友好、俏皮、甜美等多种风格
- **历史记录管理**：自动保存聊天历史，支持快速查看和复用

### 🛡️ 安全保障
- **API密钥保护**：敏感信息存储在环境变量中，不会上传到代码仓库
- **本地数据存储**：聊天记录仅保存在浏览器本地，保护隐私
- **安全配置指南**：详细的配置说明，确保使用安全

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- Deepseek API 密钥

### 1. 克隆项目
```bash
git clone https://github.com/your-username/love-chat-ai.git
cd love-chat-ai
```

### 2. 安装依赖
```bash
npm install
# 或
yarn install
```

### 3. 配置环境变量
复制环境变量示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入您的 Deepseek API 密钥：
```env
# Deepseek AI 配置
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# 应用配置
NEXT_PUBLIC_APP_NAME=Love Chat AI
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEFAULT_PROVIDER=deepseek

# 开发调试
DEBUG_MODE=false
```

### 4. 获取 Deepseek API 密钥

1. 访问 [Deepseek 官网](https://platform.deepseek.com/)
2. 注册并登录账户
3. 在 API 管理页面创建新的 API 密钥
4. 将密钥复制到 `.env.local` 文件中

### 5. 启动应用
```bash
npm run dev
# 或
yarn dev
```

应用将在 `http://localhost:3000` 启动。

## 📁 项目结构

```
love-chat-ai/
├── app/                    # Next.js 13 App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 应用布局
│   └── page.tsx           # 主页面
├── components/            # UI 组件
│   └── ui/               # shadcn/ui 组件库
├── config/               # 配置文件
│   ├── ai-config.ts      # AI 模型配置
│   └── deepseek-client.ts # Deepseek 客户端配置
├── lib/                  # 工具函数
├── .env.example          # 环境变量示例
├── .env.local           # 本地环境变量（不会提交到 Git）
└── README.md            # 项目说明
```

## 🎨 使用指南

### 基本使用流程

1. **选择身份**：选择您是男生还是女生
2. **输入消息**：输入对方发来的消息
3. **调整关系阶段**：使用滑块选择当前的关系阶段（1-10级）
4. **生成回复**：点击"开始回复"按钮
5. **选择回复**：从3条生成的回复中选择最合适的
6. **复制使用**：点击复制按钮将回复复制到剪贴板

### 关系阶段说明

| 级别 | 阶段 | 特点 |
|------|------|------|
| 1 | 刚认识 | 礼貌保守，保持距离 |
| 2 | 初步了解 | 友好但谨慎 |
| 3 | 朋友阶段 | 自然友好，轻松玩笑 |
| 4 | 好朋友 | 热情关怀，温暖表达 |
| 5 | 暧昧期 | 适度调情，小暧昧 |
| 6 | 互有好感 | 明显好感，轻微撩拨 |
| 7 | 热恋期 | 甜言蜜语，浪漫表达 |
| 8 | 深度恋爱 | 深情浓烈，甜蜜满满 |
| 9 | 亲密爱人 | 极其亲密，爱称满满 |
| 10 | 灵魂伴侣 | 心灵相通，深层理解 |

## 🛠️ 技术栈

- **前端框架**：Next.js 13 (App Router)
- **编程语言**：TypeScript
- **样式方案**：Tailwind CSS
- **UI 组件**：Radix UI + shadcn/ui
- **AI 模型**：Deepseek Chat
- **状态管理**：React Hooks
- **数据存储**：LocalStorage（客户端）

## 🔧 开发配置

### 环境变量说明

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `DEEPSEEK_API_KEY` | Deepseek API 密钥 | ✅ | - |
| `DEEPSEEK_BASE_URL` | Deepseek API 基础URL | ❌ | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | 使用的模型名称 | ❌ | `deepseek-chat` |
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | ❌ | `Love Chat AI` |
| `DEBUG_MODE` | 调试模式 | ❌ | `false` |

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🔒 安全说明

### ⚠️ 重要提醒

1. **API 密钥安全**：
   - ✅ 所有 API 密钥存储在 `.env.local` 文件中
   - ✅ `.env.local` 已添加到 `.gitignore`，不会上传到 GitHub
   - ✅ 提供 `.env.example` 作为配置参考
   - ❌ **请勿**将真实的 API 密钥提交到代码仓库

2. **隐私保护**：
   - 聊天记录仅保存在浏览器本地存储中
   - 不会上传到任何服务器
   - 定期清理浏览器缓存可删除历史记录

3. **使用建议**：
   - 仅用于学习和娱乐目的
   - 生成的回复仅供参考，请结合实际情况使用
   - 保持真诚交流，避免过度依赖 AI

## 📝 更新日志
S
### v1.0.0 (2025-07-27)
- 🎉 初始版本发布
- ✨ 支持 Deepseek AI 聊天
- 🎨 响应式 UI 设计
- 💾 本地历史记录功能
- 🔧 完整的环境配置系统

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 提交 Bug 报告
- 使用 GitHub Issues
- 提供详细的复现步骤
- 包含错误截图或日志

### 功能建议
- 在 Issues 中描述新功能
- 说明使用场景和预期效果

### 代码贡献
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⭐ 支持项目

如果这个项目对您有帮助，请给它一个 ⭐ Star！

---

<div align="center">

**用 ❤️ 和 ☕ 制作**

[报告问题](https://github.com/your-username/love-chat-ai/issues) · 
[功能建议](https://github.com/your-username/love-chat-ai/issues) · 
[贡献代码](https://github.com/your-username/love-chat-ai/pulls)

</div> 