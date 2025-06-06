
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GeminiRequest {
  contents: {
    parts: { text: string }[];
  }[];
}

interface DeepSeekRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

class AIService {
  private openaiApiKey = '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';
  private geminiApiKey = 'AIzaSyB4frRuhdWmCrUfyUojOTYcFJ9HQFqbhTY';
  private deepseekApiKey = 'sk-492ce24a2e0743ce98cacd3eea74667c';

  async callOpenAI(prompt: string, featureContext: string): Promise<string> {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding assistant specialized in ${featureContext}. Provide accurate, well-structured code solutions with proper explanations.`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to process request with OpenAI');
    }
  }

  async callGemini(prompt: string, featureContext: string): Promise<string> {
    try {
      const requestBody: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: `As an expert coding assistant specialized in ${featureContext}, please help with: ${prompt}`
              }
            ]
          }
        ]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to process request with Gemini');
    }
  }

  async callDeepSeek(prompt: string, featureContext: string): Promise<string> {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding assistant specialized in ${featureContext}. Provide accurate, well-structured code solutions with proper explanations.`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const requestBody: DeepSeekRequest = {
        model: 'deepseek-coder',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7
      };

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to process request with DeepSeek');
    }
  }

  // Smart provider selection based on task type
  getOptimalProvider(featureId: string, taskType: 'code' | 'explanation'): 'OpenAI' | 'Gemini' | 'DeepSeek' {
    // For code generation tasks, DeepSeek and Gemini are best
    if (taskType === 'code') {
      const codeFeatures = ['prompt-to-code', 'refactoring', 'code-optimization', 'bug-fixing', 'style-formatter'];
      if (codeFeatures.includes(featureId)) {
        return 'DeepSeek'; // Best for code generation
      }
      return 'Gemini'; // Good alternative for code
    }
    
    // For explanation tasks, OpenAI is best
    if (taskType === 'explanation') {
      const explanationFeatures = ['code-explanation', 'error-explainer', 'code-review', 'complexity-analyzer'];
      if (explanationFeatures.includes(featureId)) {
        return 'OpenAI'; // Best for explanations
      }
    }

    // Default fallback
    return 'DeepSeek';
  }

  async processPrompt(prompt: string, featureId: string, apiProvider: 'OpenAI' | 'Gemini' | 'DeepSeek' | 'Auto' | 'Both'): Promise<string> {
    const featureContext = this.getFeatureContext(featureId);

    try {
      if (apiProvider === 'Auto') {
        // Auto-select best provider based on task
        const taskType = this.determineTaskType(prompt, featureId);
        const optimalProvider = this.getOptimalProvider(featureId, taskType);
        apiProvider = optimalProvider;
      }

      if (apiProvider === 'OpenAI') {
        return await this.callOpenAI(prompt, featureContext);
      } else if (apiProvider === 'Gemini') {
        return await this.callGemini(prompt, featureContext);
      } else if (apiProvider === 'DeepSeek') {
        return await this.callDeepSeek(prompt, featureContext);
      } else if (apiProvider === 'Both') {
        // Try DeepSeek first (best for code), fallback to Gemini, then OpenAI
        try {
          return await this.callDeepSeek(prompt, featureContext);
        } catch (error) {
          console.log('DeepSeek failed, trying Gemini...');
          try {
            return await this.callGemini(prompt, featureContext);
          } catch (error) {
            console.log('Gemini failed, trying OpenAI...');
            return await this.callOpenAI(prompt, featureContext);
          }
        }
      }
    } catch (error) {
      throw error;
    }

    throw new Error('Invalid API provider specified');
  }

  private determineTaskType(prompt: string, featureId: string): 'code' | 'explanation' {
    const explanationKeywords = ['explain', 'understand', 'what does', 'how does', 'analyze', 'review'];
    const codeKeywords = ['generate', 'create', 'build', 'fix', 'optimize', 'refactor', 'format'];
    
    const lowerPrompt = prompt.toLowerCase();
    
    const hasExplanationKeywords = explanationKeywords.some(keyword => lowerPrompt.includes(keyword));
    const hasCodeKeywords = codeKeywords.some(keyword => lowerPrompt.includes(keyword));
    
    if (hasExplanationKeywords && !hasCodeKeywords) {
      return 'explanation';
    }
    
    return 'code'; // Default to code for most programming tasks
  }

  private getFeatureContext(featureId: string): string {
    const contexts: Record<string, string> = {
      'prompt-to-code': 'code generation from natural language',
      'code-explanation': 'code analysis and explanation',
      'debugger': 'debugging and error detection',
      'refactoring': 'code refactoring and optimization',
      'translator': 'programming language translation',
      'snippet-search': 'code snippet examples',
      'scaffold-generator': 'project structure generation',
      'error-explainer': 'error message explanation',
      'library-suggester': 'library and framework recommendations',
      'style-formatter': 'code formatting and style guides',
      'security-scanner': 'security vulnerability detection',
      'test-generator': 'unit test generation',
      'complexity-analyzer': 'algorithm complexity analysis',
      'code-reviewer': 'code review and quality assessment',
      'voice-assistant': 'voice-controlled coding',
      'code-summarizer': 'code summarization',
      'multilingual-comments': 'multilingual code documentation',
      'complexity-optimizer': 'performance optimization',
      'pair-programming': 'interactive coding assistance',
      'coding-tutor': 'programming education and tutoring'
    };
    
    return contexts[featureId] || 'general programming assistance';
  }
}

export const aiService = new AIService();
