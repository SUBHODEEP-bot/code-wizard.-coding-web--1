
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, AlertTriangle } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const SecurityScanner = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [scanType, setScanType] = useState('');
  const [securityReport, setSecurityReport] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust'
  ];

  const scanTypes = [
    'SQL Injection', 'XSS Vulnerabilities', 'Authentication Issues', 'Input Validation', 
    'Buffer Overflow', 'Insecure Dependencies', 'Hardcoded Secrets', 'All Vulnerabilities'
  ];

  const handleScan = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    const prompt = `Perform a comprehensive security scan on this ${language} code:

Code:
${code}

${scanType ? `Focus on: ${scanType}` : 'Scan for all security vulnerabilities'}

Please analyze for:
1. SQL injection vulnerabilities
2. Cross-site scripting (XSS) risks
3. Authentication and authorization flaws
4. Input validation issues
5. Hardcoded credentials or secrets
6. Insecure dependencies
7. Buffer overflow risks
8. Privilege escalation vulnerabilities
9. Insecure cryptographic practices
10. Other security best practices violations

For each vulnerability found:
- Severity level (Critical/High/Medium/Low)
- Detailed explanation of the risk
- Specific line numbers if applicable
- Remediation steps
- Secure code examples

Provide a security score (1-10) and overall recommendations.`;

    try {
      const result = await aiService.processPrompt(prompt, 'security-scanner', 'Both');
      setSecurityReport(result);
      toast({
        title: "Security Scan Complete",
        description: "Security vulnerabilities have been analyzed",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Security scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to complete security scan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-red-600 to-red-800 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">SECURITY_SCANNER</h2>
              <p className="text-sm text-gray-300 font-mono">Detect security vulnerabilities in code</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white border-0 font-mono">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Multi-AI Security
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">SCAN_FOCUS</label>
            <Select value={scanType} onValueChange={setScanType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select scan type (optional)..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {scanTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_SCAN</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for security analysis..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-mono"
          >
            {isScanning ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                SCAN_SECURITY
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={securityReport}
          isProcessing={isScanning}
          error={null}
          selectedLanguage={{ name: 'Security Report', extension: 'md', icon: '🛡️', color: 'text-red-400' }}
          selectedFeature="security-scanner"
        />
      </div>
    </div>
  );
};
