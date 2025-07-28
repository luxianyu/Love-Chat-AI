import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 在服务端安全地读取环境变量
const openai = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // 检查API密钥是否配置
    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'Deepseek API密钥未配置' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages, model = 'deepseek-chat', temperature = 0.8 } = body;

    // 调用 Deepseek API
    const completion = await openai.chat.completions.create({
      messages,
      model,
      temperature,
    });

    const content = completion.choices[0].message.content || '';
    return NextResponse.json({ content });

  } catch (error) {
    console.error('API调用错误:', error);
    return NextResponse.json(
      { error: '生成回复时出错，请稍后再试' },
      { status: 500 }
    );
  }
} 