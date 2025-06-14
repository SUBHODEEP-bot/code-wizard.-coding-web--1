
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Code, 
  Terminal, 
  Zap, 
  Shield, 
  ArrowRight, 
  Cpu, 
  Network,
  Play,
  ChevronRight,
  Sparkles,
  Brain,
  Rocket
} from 'lucide-react';
import { features } from '@/data/features';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const stats = [
    { label: 'AI Models', value: '3+', icon: Brain },
    { label: 'Code Features', value: '20+', icon: Code },
    { label: 'Languages', value: '15+', icon: Terminal },
    { label: 'Protocols', value: '∞', icon: Network }
  ];

  const coreFeatures = features.filter(f => f.category === 'core');
  const advancedFeatures = features.filter(f => f.category === 'advanced');
  const interactiveFeatures = features.filter(f => f.category === 'interactive');

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20"></div>
        <div className="hacker-grid absolute inset-0"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-gray-950/90 backdrop-blur-sm border-b border-green-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-mono tracking-wider">
                  <span className="text-green-400">AI</span>_CODER_<span className="text-blue-400">NEXUS</span>
                </h1>
                <p className="text-xs text-gray-400 font-mono">NEURAL_CODING_INTERFACE</p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-mono border-0"
            >
              <Terminal className="h-4 w-4 mr-2" />
              LAUNCH_INTERFACE
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 font-mono px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              NEURAL_AI_POWERED
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white font-mono tracking-tight">
              CODE BEYOND
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                LIMITS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 font-mono max-w-4xl mx-auto leading-relaxed">
              Harness the power of <span className="text-green-400">advanced AI neural networks</span> to 
              transform ideas into production-ready code. Debug, optimize, and architect with 
              <span className="text-blue-400"> superhuman precision</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/app')}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-mono text-lg px-8 py-4 shadow-lg neon-green"
            >
              <Play className="h-5 w-5 mr-2" />
              INITIALIZE_CODING
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono text-lg px-8 py-4"
            >
              <Terminal className="h-5 w-5 mr-2" />
              VIEW_PROTOCOLS
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-green-500/30">
                <stat.icon className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Modules */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-mono mb-4">
            <span className="text-green-400">CORE</span>_NEURAL_MODULES
          </h2>
          <p className="text-gray-300 font-mono">Essential AI-powered coding capabilities for every developer</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature) => (
            <Card 
              key={feature.id}
              className="bg-gray-950/50 border-green-500/30 hover:border-green-400/50 transition-all duration-300 group cursor-pointer"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
                    <feature.icon className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-mono text-lg">{feature.name}</CardTitle>
                    <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 font-mono text-xs">
                      {feature.apiProvider}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 font-mono">
                  {feature.description}
                </CardDescription>
                {hoveredFeature === feature.id && (
                  <div className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-300 font-mono animate-fade-in">
                    {feature.examplePrompt}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Protocols */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-mono mb-4">
            <span className="text-blue-400">ADVANCED</span>_PROTOCOLS
          </h2>
          <p className="text-gray-300 font-mono">Professional-grade tools for enterprise development</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedFeatures.map((feature) => (
            <Card 
              key={feature.id}
              className="bg-gray-950/50 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded border border-blue-500/30">
                    <feature.icon className="h-4 w-4 text-blue-400" />
                  </div>
                  <CardTitle className="text-white font-mono text-sm">{feature.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-400 font-mono text-xs">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Neural Interface */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-mono mb-4">
            <span className="text-purple-400">NEURAL</span>_INTERFACE
          </h2>
          <p className="text-gray-300 font-mono">Next-generation interactive coding experiences</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interactiveFeatures.map((feature) => (
            <Card 
              key={feature.id}
              className="bg-gray-950/50 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                    <feature.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-white font-mono">{feature.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 font-mono">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center bg-gradient-to-r from-gray-950/80 to-gray-900/80 rounded-2xl border border-green-500/30 p-12 backdrop-blur-sm">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-mono">
              READY TO <span className="text-green-400">EVOLVE</span> YOUR CODE?
            </h2>
            <p className="text-xl text-gray-300 font-mono max-w-2xl mx-auto">
              Join the next generation of developers using AI-powered neural networks 
              to build the impossible.
            </p>
            <Button 
              onClick={() => navigate('/app')}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-mono text-xl px-12 py-6 shadow-2xl neon-green"
            >
              <Rocket className="h-6 w-6 mr-3" />
              ENTER_THE_MATRIX
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-950/90 border-t border-green-500/30 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-white font-mono font-semibold">AI_CODER_NEXUS</div>
                <div className="text-xs text-gray-400 font-mono">NEURAL_CODING_INTERFACE</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400 font-mono">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>SECURE_NEURAL_CONNECTION</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-blue-400" />
                <span>AI_POWERED</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
