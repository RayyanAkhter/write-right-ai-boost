
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center gap-2 font-semibold">
          <FileText className="h-6 w-6 text-brand-600" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
            WriteRight
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link to="/new-content">
            <Button variant="ghost" size="sm">
              Create Content
            </Button>
          </Link>
          <Button variant="default" size="sm" className="bg-brand-600 hover:bg-brand-700">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
