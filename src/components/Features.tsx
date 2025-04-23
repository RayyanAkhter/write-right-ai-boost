
import { FileText, Search, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-brand-600" />,
      title: "AI Content Generation",
      description:
        "Generate high-quality, engaging content on any topic with our advanced AI writing assistant.",
    },
    {
      icon: <Search className="h-10 w-10 text-brand-600" />,
      title: "SEO Optimization",
      description:
        "Get real-time SEO suggestions to improve your content's visibility and ranking on search engines.",
    },
    {
      icon: <Settings className="h-10 w-10 text-brand-600" />,
      title: "Export & Publish",
      description:
        "Export your optimized content in multiple formats or publish directly to platforms like WordPress.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features for Content Creators
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
