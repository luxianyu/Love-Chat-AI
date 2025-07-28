/**
 * Deepseek AI客户端配置
 * 专门用于恋爱聊天场景的配置
 */

import { aiConfig } from './ai-config';

// Deepseek聊天配置
export interface DeepseekChatConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

// 恋爱聊天专用配置
export interface LoveChatConfig extends DeepseekChatConfig {
  systemPrompt: string;
  conversationStyle: 'romantic' | 'friendly' | 'flirty' | 'sweet';
  responseLength: 'short' | 'medium' | 'long';
}

/**
 * 获取Deepseek基础配置
 */
export function getDeepseekConfig(): DeepseekChatConfig {
  const config = aiConfig.deepseek;
  
  return {
    apiKey: config.apiKey || '',
    baseUrl: config.baseUrl || 'https://api.deepseek.com',
    model: config.model || 'deepseek-chat',
    maxTokens: 1000,
    temperature: 0.8, // 适合聊天的温度
    topP: 0.9,
    frequencyPenalty: 0.3, // 减少重复
    presencePenalty: 0.2   // 鼓励多样性
  };
}

/**
 * 获取恋爱聊天专用配置
 */
export function getLoveChatConfig(
  style: LoveChatConfig['conversationStyle'] = 'romantic',
  responseLength: LoveChatConfig['responseLength'] = 'medium'
): LoveChatConfig {
  const baseConfig = getDeepseekConfig();
  
  // 根据聊天风格调整系统提示词
  const systemPrompts = {
    romantic: `你是一个温柔体贴的恋爱伙伴，善于表达情感，回复要充满爱意和温暖。用甜蜜的话语与对方交流，但要保持真诚和自然。`,
    friendly: `你是一个友善亲切的聊天伙伴，善于倾听和理解，回复要温暖友好，营造轻松愉快的氛围。`,
    flirty: `你是一个俏皮可爱的聊天伙伴，善于幽默调侃，回复要带有一点小小的调情味道，但要把握好分寸。`,
    sweet: `你是一个甜美可爱的聊天伙伴，回复要充满甜蜜和关怀，像小天使一样温柔贴心。`
  };
  
  // 根据回复长度调整maxTokens
  const tokenLimits = {
    short: 200,
    medium: 500,
    long: 800
  };
  
  return {
    ...baseConfig,
    maxTokens: tokenLimits[responseLength],
    systemPrompt: systemPrompts[style],
    conversationStyle: style,
    responseLength
  };
}

/**
 * 创建聊天消息格式
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 检查Deepseek配置是否有效
 */
export function validateDeepseekConfig(): {
  isValid: boolean;
  error?: string;
} {
  const config = aiConfig.deepseek;
  
  // 只检查API key，其他配置使用默认值
  if (!config.apiKey || config.apiKey.trim() === '') {
    return {
      isValid: false,
      error: 'Deepseek API密钥未配置，请在 .env.local 文件中设置 DEEPSEEK_API_KEY'
    };
  }
  
  // 确保有默认的baseUrl
  if (!config.baseUrl) {
    config.baseUrl = 'https://api.deepseek.com';
  }
  
  // 确保有默认的model
  if (!config.model) {
    config.model = 'deepseek-chat';
  }
  
  return { isValid: true };
}

/**
 * 预设的恋爱聊天场景配置
 */
export const LOVE_CHAT_PRESETS = {
  // 初次见面
  firstMeeting: getLoveChatConfig('friendly', 'medium'),
  
  // 日常聊天
  dailyChat: getLoveChatConfig('sweet', 'medium'),
  
  // 浪漫时光
  romanticMoment: getLoveChatConfig('romantic', 'long'),
  
  // 轻松调侃
  playfulBanter: getLoveChatConfig('flirty', 'short'),
  
  // 深度交流
  deepConversation: getLoveChatConfig('romantic', 'long')
} as const;

export type LoveChatPreset = keyof typeof LOVE_CHAT_PRESETS; 