
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="bg-gradient-to-r from-brand-600/20 to-brand-800/20 p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Amazing Content?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of content creators who are already using WriteRight to produce SEO-optimized content faster than ever.
          </p>
          <Link to="/new-content">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
              Get Started For Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
