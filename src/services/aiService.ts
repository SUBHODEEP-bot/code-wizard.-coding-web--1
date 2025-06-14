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
      const enhancedPrompt = this.enhancePromptForFormatting(prompt, featureContext);
      
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are an expert coding assistant specialized in ${featureContext}. When generating multiple examples or solutions, you MUST format them with clear numbering and separation. STRICTLY follow this format:

---
## Example 1: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---
## Example 2: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---
## Example 3: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---

CRITICAL RULES:
1. Use horizontal lines (---) between each example
2. Each example must have a clear numbered header
3. Each code block must be complete and functional
4. Add explanations after each code block
5. Never mix examples together
6. Always separate different approaches clearly

Each example should be complete, functional, and clearly separated from others. Provide accurate, well-structured explanations and analysis with clear insights.`
        },
        {
          role: 'user',
          content: enhancedPrompt
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
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from OpenAI' }));
        console.error('OpenAI API error:', response.status, errorData);
        
        // Handle quota exceeded specifically
        if (response.status === 429) {
          throw new Error(`OpenAI API quota exceeded. Please try again later or contact support.`);
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('OpenAI response received successfully.');
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
        return data.choices[0].message.content;
      } else {
        console.error('OpenAI response missing expected content structure:', data);
        throw new Error('OpenAI response structure was not as expected. Check logs for details.');
      }
    } catch (error) {
      console.error('Error in callOpenAI:', error);
      if (error instanceof Error) {
        throw error; // Re-throw if already an Error instance
      }
      throw new Error('Failed to process request with OpenAI due to an unexpected error.');
    }
  }

  async callGemini(prompt: string, featureContext: string): Promise<string> {
    try {
      console.log('Calling Gemini API for:', featureContext);
      const enhancedPrompt = this.enhancePromptForFormatting(prompt, featureContext);
      
      const requestBody: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: `As an expert coding assistant specialized in ${featureContext}, when generating multiple examples or solutions, you MUST format them with clear numbering and separation. STRICTLY follow this format:

---
## Example 1: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---
## Example 2: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---
## Example 3: [Brief Description]
\`\`\`language
// Code here
\`\`\`
**Explanation:** Brief explanation of this example.

---

CRITICAL RULES:
1. Use horizontal lines (---) between each example
2. Each example must have a clear numbered header
3. Each code block must be complete and functional
4. Add explanations after each code block
5. Never mix examples together
6. Always separate different approaches clearly

Each example should be complete, functional, and clearly separated from others.

Please help with: ${enhancedPrompt}`
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
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response from Gemini' }));
        console.error('Gemini API error:', response.status, errorData);
        
        // Handle quota exceeded specifically for Gemini too
        if (response.status === 429) {
          throw new Error(`Gemini API quota exceeded. Please try again later.`);
        }
        
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Gemini response received successfully.');

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0 && typeof data.candidates[0].content.parts[0].text === 'string') {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Gemini response missing expected content structure:', data);
        throw new Error('Gemini response structure was not as expected. Check logs for details.');
      }
    } catch (error) {
      console.error('Error in callGemini:', error);
      if (error instanceof Error) {
        throw error; // Re-throw if already an Error instance
      }
      throw new Error('Failed to process request with Gemini due to an unexpected error.');
    }
  }

  private enhancePromptForFormatting(prompt: string, featureContext: string): string {
    // Check if the prompt is asking for multiple examples
    const multipleKeywords = ['examples', 'different ways', 'various', 'multiple', 'several', '3', 'three', 'more than one'];
    const hasMultipleRequest = multipleKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    if (hasMultipleRequest || featureContext === 'code generation from natural language') {
      return `${prompt}

CRITICAL FORMATTING REQUIREMENTS:
- If generating multiple examples or solutions, use horizontal lines (---) to separate each example
- Use clear numbered headers: "## Example 1:", "## Example 2:", etc.
- Put each code example in separate, complete code blocks
- Add explanations after each code block
- Never mix different examples together
- Make each example complete and functional on its own
- Always provide clear visual separation between different approaches

EXAMPLE FORMAT TO FOLLOW:
---
## Example 1: [Description]
\`\`\`language
// Complete code here
\`\`\`
**Explanation:** How this works...

---
## Example 2: [Description]
\`\`\`language
// Complete code here
\`\`\`
**Explanation:** How this works...

---`;
    }

    return prompt;
  }

  // Smart provider selection based on task type
  getOptimalProvider(featureId: string): 'OpenAI' | 'Gemini' {
    // For explanations and analysis - OpenAI is best (but prefer Gemini due to quota issues)
    const explanationFeatures = [
      'code-explanation', 'error-explainer', 'code-review', 'code-reviewer', 'pair-programming'
    ];
    
    // Prefer Gemini as default due to OpenAI quota limitations
    return 'Gemini';
  }

  // ... keep existing code (processPrompt method with improved error handling)
  async processPrompt(prompt: string, featureId: string, apiProvider: 'OpenAI' | 'Gemini' | 'Auto' | 'Both'): Promise<string> {
    const featureContext = this.getFeatureContext(featureId);
    console.log('Processing prompt for feature:', featureId, 'with provider:', apiProvider);

    try {
      if (apiProvider === 'Auto') {
        // Auto-select best provider based on feature (prefer Gemini due to quota issues)
        const optimalProvider = this.getOptimalProvider(featureId);
        console.log('Auto-selected provider:', optimalProvider);
        apiProvider = optimalProvider;
      }

      if (apiProvider === 'OpenAI') {
        return await this.callOpenAI(prompt, featureContext);
      } else if (apiProvider === 'Gemini') {
        return await this.callGemini(prompt, featureContext);
      } else if (apiProvider === 'Both') {
        // Try Gemini first due to quota issues, then fallback to OpenAI
        try {
          return await this.callGemini(prompt, featureContext);
        } catch (error) {
          console.log('Gemini failed, trying OpenAI as backup...', error);
          // Try OpenAI as fallback
          try {
            return await this.callOpenAI(prompt, featureContext);
          } catch (secondError) {
            console.error('Both providers failed:', secondError);
            throw error; // Re-throw original Gemini error
          }
        }
      }
    } catch (error) {
      console.error('Error in processPrompt:', error);
      
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        throw error; // Re-throw the original error to be caught by the caller
      }
      
      // Fallback for non-Error objects (though less likely with typed throws)
      throw new Error('An unexpected issue occurred in processPrompt.');
    }

    // This line should ideally not be reached if logic is correct
    throw new Error('Invalid API provider specified or unhandled execution path in processPrompt.');
  }

  // ... keep existing code (getFeatureContext method)
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
