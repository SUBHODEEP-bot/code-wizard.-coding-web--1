
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GeminiRequest {
  contents: {
    parts: { text: string }[];
  }[];
}

class AIService {
  private openaiApiKey = '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';
  private geminiApiKey = 'AIzaSyAxTmaNTs0N9OHkFgbw2XEZOmalMW3al7A';

  async callOpenAI(prompt: string, featureContext: string): Promise<string> {
    try {
      console.log('Calling OpenAI API for:', featureContext);
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding assistant specialized in ${featureContext}. Provide accurate, well-structured explanations and analysis with clear insights.`
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
          model: 'gpt-4',
          messages: messages,
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenAI response received successfully');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to process request with OpenAI');
    }
  }

  async callGemini(prompt: string, featureContext: string): Promise<string> {
    try {
      console.log('Calling Gemini API for:', featureContext);
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
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Gemini response received successfully');
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to process request with Gemini');
    }
  }

  // Smart provider selection based on task type
  getOptimalProvider(featureId: string): 'OpenAI' | 'Gemini' {
    // For explanations and analysis - OpenAI is best
    const explanationFeatures = [
      'code-explanation', 'error-explainer', 'code-review', 'code-reviewer', 'pair-programming'
    ];
    
    // For all other features - use Gemini as default
    if (explanationFeatures.includes(featureId)) {
      return 'OpenAI';
    }

    // Default to Gemini for all other tasks
    return 'Gemini';
  }

  async processPrompt(prompt: string, featureId: string, apiProvider: 'OpenAI' | 'Gemini' | 'Auto' | 'Both'): Promise<string> {
    const featureContext = this.getFeatureContext(featureId);
    console.log('Processing prompt for feature:', featureId, 'with provider:', apiProvider);

    try {
      if (apiProvider === 'Auto') {
        // Auto-select best provider based on feature
        const optimalProvider = this.getOptimalProvider(featureId);
        console.log('Auto-selected provider:', optimalProvider);
        apiProvider = optimalProvider;
      }

      if (apiProvider === 'OpenAI') {
        return await this.callOpenAI(prompt, featureContext);
      } else if (apiProvider === 'Gemini') {
        return await this.callGemini(prompt, featureContext);
      } else if (apiProvider === 'Both') {
        // Try optimal provider first, then fallback to others
        const optimalProvider = this.getOptimalProvider(featureId);
        try {
          if (optimalProvider === 'OpenAI') {
            return await this.callOpenAI(prompt, featureContext);
          } else {
            return await this.callGemini(prompt, featureContext);
          }
        } catch (error) {
          console.log(`${optimalProvider} failed, trying fallback...`);
          // Try other provider as fallback
          try {
            if (optimalProvider !== 'OpenAI') {
              return await this.callOpenAI(prompt, featureContext);
            } else {
              return await this.callGemini(prompt, featureContext);
            }
          } catch (secondError) {
            throw error; // Re-throw original error
          }
        }
      }
    } catch (error) {
      console.error('Error in processPrompt:', error);
      throw error;
    }

    throw new Error('Invalid API provider specified');
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
      'code-review': 'code review and quality assessment',
      'bug-fixing': 'bug detection and fixing',
      'code-optimization': 'performance optimization',
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
