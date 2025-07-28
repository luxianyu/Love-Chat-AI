"use client";

import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle, RotateCcw, Send, Copy, Check } from 'lucide-react';

interface ChatHistory {
  input: string;
  flirtLevel: number;
  responses: string[];
  timestamp: number;
}

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [flirtLevel, setFlirtLevel] = useState([5]);
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(-1);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<number | null>(null);
  const [userGender, setUserGender] = useState<'male' | 'female'>('male');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 配置检查现在在服务端进行

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Validate the structure of each history item
        const validHistory = parsedHistory.filter((item: any) => {
          return (
            item &&
            typeof item === 'object' &&
            typeof item.input === 'string' &&
            typeof item.flirtLevel === 'number' &&
            Array.isArray(item.responses) &&
            item.responses.every((response: any) => typeof response === 'string') &&
            typeof item.timestamp === 'number'
          );
        });
        setHistory(validHistory);
        
        // If we filtered out invalid items, update localStorage
        if (validHistory.length !== parsedHistory.length) {
          localStorage.setItem('chatHistory', JSON.stringify(validHistory));
        }
      } catch (error) {
        console.error('Error parsing chat history:', error);
        // Clear invalid data and start fresh
        localStorage.removeItem('chatHistory');
        setHistory([]);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (input: string, flirtLevel: number, responses: string[]) => {
    const newEntry: ChatHistory = {
      input,
      flirtLevel,
      responses,
      timestamp: Date.now()
    };
    const updatedHistory = [newEntry, ...history.slice(0, 9)]; // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
  };

  // Get flirt level description
  const getFlirtLevelDescription = (level: number) => {
    const descriptions = {
      1: "刚认识",
      2: "初步了解", 
      3: "朋友阶段",
      4: "好朋友",
      5: "暧昧期",
      6: "互有好感",
      7: "热恋期",
      8: "深度恋爱",
      9: "亲密爱人",
      10: "灵魂伴侣"
    };
    return descriptions[Math.min(10, Math.max(1, level)) as keyof typeof descriptions];
  };
  // Generate system prompt based on flirt level
  const generateSystemPrompt = (level: number) => {
    const genderContext = userGender === 'male' ? '你在帮助一个男生回复女生的消息' : '你在帮助一个女生回复男生的消息';
    
    const prompts = {
      1: `你是刚认识阶段的聊天助手。${genderContext}。回复要非常礼貌、保守，保持适当距离，避免过于亲密的表达。`,
      2: `你是初步了解阶段的聊天助手。${genderContext}。回复要友好但谨慎，可以表现出一些兴趣，但要保持分寸。`,
      3: `你是朋友阶段的聊天助手。${genderContext}。回复要自然友好，可以开一些轻松的玩笑，表现出关心。`,
      4: `你是好朋友阶段的聊天助手。${genderContext}。回复要热情友好，可以有更多的关怀和温暖的表达。`,
      5: `你是暧昧期的聊天助手。${genderContext}。回复要有一些小暧昧，可以适度调情，但不要太直接。`,
      6: `你是互有好感阶段的聊天助手。${genderContext}。回复要甜蜜一些，可以有明显的好感表达和轻微的撩拨。`,
      7: `你是热恋期的聊天助手。${genderContext}。回复要充满爱意，可以有甜言蜜语和浪漫的表达。`,
      8: `你是深度恋爱阶段的聊天助手。${genderContext}。回复要非常甜蜜，充满深情和浓烈的爱意表达。`,
      9: `你是亲密爱人阶段的聊天助手。${genderContext}。回复要极其亲密甜蜜，可以有很多爱称和深情的话语。`,
      10: `你是灵魂伴侣阶段的聊天助手。${genderContext}。回复要体现深层的理解和默契，充满深沉的爱意和心灵相通的感觉。`
    };
    
    const basePrompt = prompts[Math.min(10, Math.max(1, level)) as keyof typeof prompts];
    
    return `${basePrompt}

请根据用户输入的"${userGender === 'male' ? '女生' : '男生'}的话"，生成3条不同风格的回复。要求：
1. 每条回复都要符合当前的暧昧程度
2. 回复要自然、有趣、有吸引力
3. 避免重复，每条回复要有不同的角度和风格
4. 回复长度适中，不要太长也不要太短
5. 使用现代年轻人的聊天语言风格
6. 回复要符合${userGender === 'male' ? '男生' : '女生'}的身份和语言习惯

请直接返回3条回复，用换行符分隔，不要添加序号或其他标记。`;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string, index: number | string) => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (clipboardError) {
          // If modern API fails, fall back to traditional method
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      } else {
        // Fallback to traditional method
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  // Typewriter effect
  const typeMessage = async (message: string, responseIndex: number) => {
    setResponses(prev => {
      const newResponses = [...prev];
      newResponses[responseIndex] = '';
      return newResponses;
    });

    for (let i = 0; i <= message.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setResponses(prev => {
        const newResponses = [...prev];
        newResponses[responseIndex] = message.slice(0, i);
        return newResponses;
      });
    }
  };

  // Generate responses
  const generateResponses = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setResponses(['', '', '']);
    setCurrentResponseIndex(-1);

    try {
      // 调用我们的安全 API 路由
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: generateSystemPrompt(flirtLevel[0]) },
            { role: "user", content: userInput }
          ],
          model: "deepseek-chat",
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '服务器错误');
      }

      const data = await response.json();
      const content = data.content || '';
      const generatedResponses = content.split('\n').filter((r: string) => r.trim()).slice(0, 3);
      
      // Ensure we have exactly 3 responses
      while (generatedResponses.length < 3) {
        generatedResponses.push('正在思考更好的回复...');
      }

      // Type each response sequentially
      for (let i = 0; i < 3; i++) {
        setCurrentResponseIndex(i);
        await typeMessage(generatedResponses[i], i);
        await new Promise(resolve => setTimeout(resolve, 500)); // Pause between responses
      }

      // Save to history
      saveToHistory(userInput, flirtLevel[0], generatedResponses);
      
    } catch (error) {
      console.error('Error generating responses:', error);
      const errorResponses = [
        '哎呀，我的小脑瓜有点卡住了 🤔',
        '让我重新组织一下语言...',
        '稍等，正在想更好的回复方式 💭'
      ];
      
      for (let i = 0; i < 3; i++) {
        setCurrentResponseIndex(i);
        await typeMessage(errorResponses[i], i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setCurrentResponseIndex(-1);
    setIsGenerating(false);
  };

  // Handle textarea focus
  const handleInputFocus = () => {
    setUserInput('');
  };

  // Reset function
  const handleReset = () => {
    setUserInput('');
    setResponses(['', '', '']);
    setCurrentResponseIndex(-1);
    setSelectedHistoryIndex(null);
  };

  // Handle history item click
  const handleHistoryClick = (item: ChatHistory, index: number) => {
    if (selectedHistoryIndex === index) {
      setSelectedHistoryIndex(null);
    } else {
      setSelectedHistoryIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-6 h-6 text-[#07C160]" />
            <h1 className="text-2xl font-bold text-[#181818]">恋爱聊天神器</h1>
            <Heart className="w-6 h-6 text-[#07C160]" />
          </div>
          <p className="text-[#888888] text-sm">让每句话都说到心坎里</p>
        </div>

        {/* Input Card */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#181818]">我是：</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setUserGender('male')}
                    variant={userGender === 'male' ? 'default' : 'outline'}
                    size="sm"
                    className={userGender === 'male' 
                      ? 'bg-[#07C160] hover:bg-[#06A550] text-white' 
                      : 'border-[#07C160] text-[#07C160] hover:bg-[#07C160] hover:text-white'
                    }
                  >
                    男生
                  </Button>
                  <Button
                    onClick={() => setUserGender('female')}
                    variant={userGender === 'female' ? 'default' : 'outline'}
                    size="sm"
                    className={userGender === 'female' 
                      ? 'bg-[#07C160] hover:bg-[#06A550] text-white' 
                      : 'border-[#07C160] text-[#07C160] hover:bg-[#07C160] hover:text-white'
                    }
                  >
                    女生
                  </Button>
                </div>
              </div>
            </div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#07C160]" />
              {userGender === 'male' ? '她' : '他'}说了什么？
            </CardTitle>
            <CardDescription>输入{userGender === 'male' ? '女生' : '男生'}的消息，我来帮你想回复</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              ref={textareaRef}
              placeholder={userGender === 'male' ? '例如：今天天气真不错呢～' : '例如：今天加班好累啊'}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={handleInputFocus}
              className="min-h-[80px] resize-none focus:ring-[#07C160] focus:border-[#07C160]"
            />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#181818]">关系阶段</label>
                <span className="text-sm text-[#07C160] font-medium">{getFlirtLevelDescription(flirtLevel[0])}</span>
              </div>
              <Slider
                value={flirtLevel}
                onValueChange={setFlirtLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#888888]">
                <span>刚认识</span>
                <span>暧昧期</span>
                <span>灵魂伴侣</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generateResponses}
                disabled={!userInput.trim() || isGenerating}
                className="flex-1 bg-[#07C160] hover:bg-[#06A550] text-white"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    开始回复
                  </>
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-[#07C160] text-[#07C160] hover:bg-[#07C160] hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Responses */}
        {(responses[0] || responses[1] || responses[2] || isGenerating) && (
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-[#181818]">推荐回复</CardTitle>
                  <CardDescription>选择最合适的回复，或者参考修改</CardDescription>
                </div>
                <Button
                  onClick={generateResponses}
                  disabled={!userInput.trim() || isGenerating}
                  variant="outline"
                  size="sm"
                  className="border-[#07C160] text-[#07C160] hover:bg-[#07C160] hover:text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                      重新生成
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3 mr-1" />
                      重新生成
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    currentResponseIndex === index
                      ? 'border-[#07C160] bg-[#07C160]/5'
                      : response
                      ? 'border-gray-200 bg-white hover:border-[#07C160]/50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  {response && (
                    <button
                      onClick={() => copyToClipboard(response, index)}
                      className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-100 transition-colors z-10"
                      title="复制回复"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-4 h-4 text-[#07C160]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#888888]" />
                      )}
                    </button>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      response ? 'bg-[#07C160] text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 pr-12">
                      {response ? (
                        <p className="text-[#181818] leading-relaxed">{response}</p>
                      ) : (
                        <div className="flex items-center gap-2 text-[#888888]">
                          {currentResponseIndex === index && (
                            <div className="w-3 h-3 border-2 border-[#07C160] border-t-transparent rounded-full animate-spin"></div>
                          )}
                          <span className="text-sm">
                            {currentResponseIndex === index ? '正在生成...' : '等待生成'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* History */}
        {history.length > 0 && (
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#181818]">最近记录</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.slice(0, 3).map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                     onClick={() => handleHistoryClick(item, index)}>
                  <div className="text-sm text-[#888888] mb-1">
                    关系阶段: {getFlirtLevelDescription(item.flirtLevel)}
                  </div>
                  <div className="text-sm text-[#181818] font-medium mb-2">
                    对方: {item.input}
                  </div>
                  <div className="text-xs text-[#888888]">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  
                  {selectedHistoryIndex === index && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      <div className="text-xs text-[#888888] mb-2">AI回复:</div>
                      {item.responses.map((response, responseIndex) => (
                        <div key={responseIndex} className="relative p-2 bg-white rounded border text-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(response, `history-${index}-${responseIndex}`);
                            }}
                            className="absolute top-1 right-1 p-1 rounded hover:bg-gray-100"
                          >
                            {copiedIndex === `history-${index}-${responseIndex}` ? (
                              <Check className="w-3 h-3 text-[#07C160]" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#888888]" />
                            )}
                          </button>
                          <div className="pr-6 text-[#181818]">{response}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-4 text-xs text-[#888888]">
          💡 提示：点击复制图标复制回复，点击历史记录查看详情
        </div>
      </div>
    </div>
  );
}