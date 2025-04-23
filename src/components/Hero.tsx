
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="py-20 md:py-32 px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
        AI-Powered Content Creation
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Create SEO-optimized content in seconds. Let AI help you write better, faster, and more effectively.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/new-content">
          <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
            Start Writing
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" size="lg">
            View Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
