import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="fade-in">
      <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <i className="fas fa-palette text-6xl mb-4 opacity-90"></i>
            <h1 className="text-4xl font-bold mb-2" data-testid="app-title">ICWAI</h1>
            <p className="text-xl font-light opacity-90">AI Creative Studio</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Welcome to the Future of Creativity</h2>
            <p className="text-sm leading-relaxed opacity-90 mb-4">
              Unleash your imagination with our powerful AI-driven creative tools. Transform ideas into stunning visuals, create unique LEGO designs, and explore endless creative possibilities.
            </p>
            <div className="grid grid-cols-1 gap-3 text-left">
              <div className="flex items-center">
                <i className="fas fa-magic text-yellow-300 mr-3"></i>
                <span className="text-sm">AI-Powered Drawing Assistant</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-cubes text-blue-300 mr-3"></i>
                <span className="text-sm">Custom LEGO Creator</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-smile text-green-300 mr-3"></i>
                <span className="text-sm">Interactive Playground</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setLocation("/menu")}
            className="bg-white text-primary font-semibold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
            data-testid="button-get-started"
          >
            <i className="fas fa-rocket mr-2"></i>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
