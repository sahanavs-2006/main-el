import { motion } from "framer-motion";
import { Code2, BookOpen, HelpCircle, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">KannadaCoder</h1>
              <p className="text-xs text-muted-foreground font-kannada">ಕನ್ನಡ ಕೋಡರ್</p>
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <BookOpen className="w-4 h-4" />
              Tutorials
            </Button>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
