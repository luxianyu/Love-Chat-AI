/**
 * 恋爱聊天AI配置管理
 * 主要用于管理Deepseek等大模型的API配置
 */

// 支持的AI提供商
export enum AIProvider {
  DEEPSEEK = 'deepseek',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google'
}

// AI配置接口
export interface AIConfig {
  deepseek: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  openai: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  anthropic: {
    apiKey: string;
    model: string;
  };
  google: {
    apiKey: string;
    model: string;
  };
  app: {
    name: string;
    version: string;
    defaultProvider: AIProvider;
    debugMode: boolean;
  };
}

/**
 * 安全的环境变量获取函数
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  // 优先从环境变量读取，如果是客户端且没有找到，使用硬编码的默认值
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || defaultValue;
  }
  
  // 临时硬编码配置，确保应用能正常运行
  const fallbackConfig: Record<string, string> = {
    'DEEPSEEK_API_KEY': 'sk-3778c4f444634a55b736ca018107a441',
    'DEEPSEEK_BASE_URL': 'https://api.deepseek.com',
    'DEEPSEEK_MODEL': 'deepseek-chat',
    'NEXT_PUBLIC_APP_NAME': 'Love Chat AI',
    'NEXT_PUBLIC_APP_VERSION': '1.0.0',
    'NEXT_PUBLIC_DEFAULT_PROVIDER': 'deepseek',
    'DEBUG_MODE': 'true'
  };
  
  return fallbackConfig[key] || defaultValue;
}

/**
 * 获取布尔类型环境变量
 */
function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

/**
 * 创建AI配置对象
 */
function createAIConfig(): AIConfig {
  return {
    deepseek: {
      apiKey: getEnvVar('DEEPSEEK_API_KEY'),
      baseUrl: getEnvVar('DEEPSEEK_BASE_URL', 'https://api.deepseek.com'),
      model: getEnvVar('DEEPSEEK_MODEL', 'deepseek-chat')
    },
    openai: {
      apiKey: getEnvVar('OPENAI_API_KEY'),
      baseUrl: getEnvVar('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
      model: getEnvVar('OPENAI_MODEL', 'gpt-3.5-turbo')
    },
    anthropic: {
      apiKey: getEnvVar('ANTHROPIC_API_KEY'),
      model: 'claude-3-sonnet-20240229'
    },
    google: {
      apiKey: getEnvVar('GOOGLE_API_KEY'),
      model: 'gemini-pro'
    },
    app: {
      name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Love Chat AI'),
      version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
      defaultProvider: getEnvVar('NEXT_PUBLIC_DEFAULT_PROVIDER', 'deepseek') as AIProvider,
      debugMode: getBooleanEnvVar('DEBUG_MODE', false)
    }
  };
}

// 导出配置实例
export const aiConfig = createAIConfig();

/**
 * 获取指定AI提供商的配置
 */
export function getProviderConfig(provider: AIProvider) {
  switch (provider) {
    case AIProvider.DEEPSEEK:
      return aiConfig.deepseek;
    case AIProvider.OPENAI:
      return aiConfig.openai;
    case AIProvider.ANTHROPIC:
      return aiConfig.anthropic;
    case AIProvider.GOOGLE:
      return aiConfig.google;
    default:
      throw new Error(`不支持的AI提供商: ${provider}`);
  }
}

/**
 * 检查AI提供商是否已配置
 */
export function isProviderConfigured(provider: AIProvider): boolean {
  try {
    const config = getProviderConfig(provider);
    return !!config.apiKey;
  } catch {
    return false;
  }
}

/**
 * 获取已配置的AI提供商列表
 */
export function getConfiguredProviders(): AIProvider[] {
  return Object.values(AIProvider).filter(provider => isProviderConfigured(provider));
}

/**
 * 获取默认AI提供商
 */
export function getDefaultProvider(): AIProvider {
  const defaultProvider = aiConfig.app.defaultProvider;
  
  // 检查默认提供商是否已配置
  if (isProviderConfigured(defaultProvider)) {
    return defaultProvider;
  }
  
  // 如果默认提供商未配置，返回第一个已配置的提供商
  const configuredProviders = getConfiguredProviders();
  if (configuredProviders.length > 0) {
    return configuredProviders[0];
  }
  
  // 如果都没配置，返回Deepseek作为默认值
  return AIProvider.DEEPSEEK;
}

/**
 * 验证配置完整性
 */
export function validateConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 检查是否至少有一个AI提供商已配置
  const configuredProviders = getConfiguredProviders();
  if (configuredProviders.length === 0) {
    errors.push('没有配置任何AI提供商的API密钥');
  }
  
  // 检查Deepseek配置（主要提供商）
  if (!isProviderConfigured(AIProvider.DEEPSEEK)) {
    warnings.push('Deepseek API密钥未配置，这是推荐的主要AI提供商');
  }
  
  // 检查默认提供商是否可用
  const defaultProvider = aiConfig.app.defaultProvider;
  if (!isProviderConfigured(defaultProvider)) {
    warnings.push(`默认AI提供商 ${defaultProvider} 未配置`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 开发环境下打印配置信息
 */
export function logConfigInfo(): void {
  if (aiConfig.app.debugMode) {
    const validation = validateConfig();
    
    console.log('🤖 恋爱聊天AI配置信息:');
    console.log(`应用名称: ${aiConfig.app.name}`);
    console.log(`应用版本: ${aiConfig.app.version}`);
    console.log(`默认AI提供商: ${aiConfig.app.defaultProvider}`);
    console.log(`已配置的提供商: ${getConfiguredProviders().join(', ')}`);
    
    if (validation.warnings.length > 0) {
      console.warn('⚠️ 配置警告:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    if (validation.errors.length > 0) {
      console.error('❌ 配置错误:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
    }
  }
}

// 默认导出
export default aiConfig; 