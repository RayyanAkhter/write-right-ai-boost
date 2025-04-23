import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateContent, GeneratedContent, analyzeContent } from "@/services/geminiService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Settings, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { publishToWordPress } from "@/services/wordpressService";

const ContentCreationPage = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [wpUrl, setWpUrl] = useState("");
  const [wpToken, setWpToken] = useState("");
  const [publishLoading, setPublishLoading] = useState(false);
  
  const { toast } = useToast();

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate content.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const keywordsList = keywords
        .split(",")
        .map(k => k.trim())
        .filter(k => k);

      const result = await generateContent({
        topic,
        tone,
        length: length as "short" | "medium" | "long",
        keywords: keywordsList,
      });

      setGeneratedContent(result);
      setActiveTab("editor");
      
      toast({
        title: "Content Generated",
        description: "Your AI content has been successfully created.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content);
      toast({
        title: "Content Copied",
        description: "Content has been copied to your clipboard.",
      });
    }
  };

  const handleExportContent = () => {
    if (generatedContent) {
      const element = document.createElement("a");
      const file = new Blob([generatedContent.content], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${generatedContent.title.replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Content Exported",
        description: "Your content has been exported as a text file.",
      });
    }
  };

  const handlePublishWordPress = async () => {
    if (!wpUrl || !wpToken || !generatedContent) {
      toast({
        title: "WordPress Info Missing",
        description: "Please enter your WordPress URL and access token.",
        variant: "destructive",
      });
      return;
    }
    setPublishLoading(true);
    const res = await publishToWordPress({
      siteUrl: wpUrl,
      token: wpToken,
      title: generatedContent.title,
      content: generatedContent.content,
    });
    setPublishLoading(false);
    if (res.success) {
      toast({
        title: "Published!",
        description: (
          <span>
            Your content was published:&nbsp;
            <a
              href={res.postUrl}
              className="underline text-blue-600 dark:text-blue-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Post
            </a>
          </span>
        ),
      });
    } else {
      toast({
        title: "Failed to Publish",
        description: res.error ?? "Unknown error",
        variant: "destructive",
      });
    }
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getSEOImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Create Content</h2>
                  <p className="text-muted-foreground mb-6">Enter a topic to generate AI-powered content with SEO optimization.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter your content topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="informative">Informative</SelectItem>
                        <SelectItem value="authoritative">Authoritative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Content Length</Label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (~300 words)</SelectItem>
                        <SelectItem value="medium">Medium (~800 words)</SelectItem>
                        <SelectItem value="long">Long (~1500 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords (comma separated)</Label>
                    <Input
                      id="keywords"
                      placeholder="seo, content marketing, digital strategy"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-brand-600 hover:bg-brand-700 mt-4" 
                    onClick={handleGenerateContent} 
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Content"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {generatedContent && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">SEO Score</h3>
                    <span className={`text-2xl font-bold ${getSEOScoreColor(generatedContent.seoScore)}`}>
                      {generatedContent.seoScore}/100
                    </span>
                  </div>
                  <Progress 
                    value={generatedContent.seoScore} 
                    className="h-2 mb-4" 
                  />
                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium">SEO Suggestions</h4>
                    {generatedContent.seoSuggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{suggestion.type}</h5>
                          <Badge 
                            variant="outline" 
                            className={`${getSEOImpactColor(suggestion.impact)} border-none`}
                          >
                            {suggestion.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:w-2/3">
            {generatedContent ? (
              <Card className="h-full">
                <CardContent className="p-0 h-full">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <div className="border-b px-3">
                      <TabsList className="h-14">
                        <TabsTrigger value="editor" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Editor</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="editor" className="flex-1 p-0 m-0 h-full flex flex-col">
                      <div className="p-4 border-b">
                        <Input 
                          value={generatedContent.title} 
                          onChange={(e) => setGeneratedContent({...generatedContent, title: e.target.value})}
                          className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                        />
                      </div>
                      <div className="flex-1 p-0">
                        <Textarea 
                          value={generatedContent.content}
                          onChange={(e) => setGeneratedContent({...generatedContent, content: e.target.value})}
                          className="h-full min-h-[500px] resize-none p-4 border-none rounded-none focus-visible:ring-0"
                        />
                      </div>
                      <div className="p-4 border-t flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          {generatedContent.content.split(/\s+/).filter(Boolean).length} words
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCopyContent}>
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleExportContent}>
                            Export
                          </Button>
                          <Button className="bg-brand-600 hover:bg-brand-700" size="sm">
                            Save
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="flex-1 p-6 space-y-6 m-0">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Content Settings</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="meta-title">Meta Title</Label>
                            <Input id="meta-title" placeholder="SEO-friendly title for this content" />
                            <p className="text-xs text-muted-foreground">55-60 characters recommended</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="meta-description">Meta Description</Label>
                            <Textarea id="meta-description" placeholder="Brief description for search results" />
                            <p className="text-xs text-muted-foreground">150-160 characters recommended</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input id="slug" placeholder="your-content-url" />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Publishing Options</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="platform">Publishing Platform</Label>
                            <Select defaultValue="none">
                              <SelectTrigger id="platform">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None (Save draft)</SelectItem>
                                <SelectItem value="wordpress">WordPress</SelectItem>
                                <SelectItem value="medium" disabled>Medium (coming soon)</SelectItem>
                                <SelectItem value="custom" disabled>Custom CMS (coming soon)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wp-url">WordPress Site URL</Label>
                            <Input
                              id="wp-url"
                              type="url"
                              placeholder="https://yourwordpresssite.com"
                              value={wpUrl}
                              onChange={e => setWpUrl(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="wp-token">WP Access Token</Label>
                            <Input
                              id="wp-token"
                              type="password"
                              placeholder="WordPress JWT or App Password"
                              value={wpToken}
                              onChange={e => setWpToken(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Store this securely; consider saving to Supabase! JWT recommended, or see WP REST API docs.<br/>
                              <a
                                href="https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/"
                                className="underline text-blue-600 dark:text-blue-300"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Learn how to get your WordPress token.</a>
                            </p>
                          </div>
                          <Button
                            className="bg-brand-600 hover:bg-brand-700"
                            onClick={handlePublishWordPress}
                            disabled={publishLoading}
                          >
                            {publishLoading ? "Publishing..." : "Publish to WordPress"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center p-8 border-dashed border-2">
                <div className="text-center max-w-md">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-medium mb-2">Start Creating Content</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill in the details on the left and click "Generate Content" to create
                    SEO-optimized content powered by AI.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      className="bg-brand-600 hover:bg-brand-700"
                      onClick={() => document.getElementById("topic")?.focus()}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentCreationPage;
