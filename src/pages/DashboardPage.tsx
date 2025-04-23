
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  status: "draft" | "published";
  seoScore: number;
}

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: "10 Proven Strategies for Content Marketing Success",
      excerpt: "Learn the top strategies for creating effective content marketing campaigns that drive results.",
      date: "2025-04-20",
      status: "published",
      seoScore: 92,
    },
    {
      id: "2",
      title: "The Ultimate Guide to SEO in 2025",
      excerpt: "Stay ahead of the competition with these cutting-edge SEO techniques for the new year.",
      date: "2025-04-18",
      status: "published",
      seoScore: 88,
    },
    {
      id: "3",
      title: "How to Create a Content Calendar for Your Blog",
      excerpt: "Organize your content strategy with an effective content calendar that drives consistency.",
      date: "2025-04-15",
      status: "published",
      seoScore: 76,
    },
    {
      id: "4",
      title: "Email Marketing Best Practices",
      excerpt: "Draft content about email marketing strategies and conversion optimization.",
      date: "2025-04-12",
      status: "draft",
      seoScore: 65,
    },
    {
      id: "5",
      title: "Social Media Strategy for Small Businesses",
      excerpt: "Draft guide for small businesses looking to leverage social media for growth.",
      date: "2025-04-10",
      status: "draft",
      seoScore: 54,
    },
  ];
  
  const filteredItems = contentItems.filter(item => {
    // Filter by search query
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = activeTab === "all" ||
                      (activeTab === "published" && item.status === "published") ||
                      (activeTab === "drafts" && item.status === "draft");
    
    return matchesSearch && matchesTab;
  });
  
  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Content Dashboard</h1>
            <p className="text-muted-foreground">Manage and optimize your AI-generated content</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-auto"
            />
            <Link to="/new-content">
              <Button className="bg-brand-600 hover:bg-brand-700 whitespace-nowrap">
                New Content
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Content</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))
              ) : (
                <EmptyState query={searchQuery} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <div className="grid gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))
              ) : (
                <EmptyState query={searchQuery} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="mt-6">
            <div className="grid gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))
              ) : (
                <EmptyState query={searchQuery} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

const ContentCard = ({ item }: { item: ContentItem }) => {
  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{item.title}</CardTitle>
            <CardDescription className="mt-2">{item.excerpt}</CardDescription>
          </div>
          <div>
            <Badge variant={item.status === "published" ? "default" : "outline"}>
              {item.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <span>Created: {new Date(item.date).toLocaleDateString()}</span>
          <span className="text-muted-foreground">•</span>
          <span>SEO Score: <span className={getSEOScoreColor(item.seoScore)}>{item.seoScore}%</span></span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyState = ({ query }: { query: string }) => {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No content found</h3>
      {query ? (
        <p className="text-muted-foreground mt-2">No results matching "{query}"</p>
      ) : (
        <p className="text-muted-foreground mt-2">Create some content to get started!</p>
      )}
      <Link to="/new-content">
        <Button className="mt-4 bg-brand-600 hover:bg-brand-700">
          Create New Content
        </Button>
      </Link>
    </div>
  );
};

export default DashboardPage;
