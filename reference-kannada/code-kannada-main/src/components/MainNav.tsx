import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Code2, BookOpen, HelpCircle, Users, LogIn, Menu, X, GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home", labelKn: "ಮುಖಪುಟ", icon: Home },
  { path: "/code", label: "Code", labelKn: "ಕೋಡ್", icon: Code2 },
  { path: "/tutorials", label: "Tutorials", labelKn: "ಟ್ಯುಟೋರಿಯಲ್ಸ್", icon: BookOpen },
  { path: "/quizzes", label: "Quizzes", labelKn: "ಕ್ವಿಜ್‌ಗಳು", icon: HelpCircle },
  { path: "/about", label: "About Us", labelKn: "ನಮ್ಮ ಬಗ್ಗೆ", icon: Users },
];

const MainNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">KalikeMate</h1>
              <p className="text-xs text-muted-foreground font-kannada">ಕಲಿಕೆ ಮೇಟ್</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`gap-2 ${isActive(item.path) ? "" : ""}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="ml-2 gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex flex-col items-start">
                    <span>{item.label}</span>
                    <span className="text-xs font-kannada opacity-70">{item.labelKn}</span>
                  </div>
                </Button>
              ))}
              <Button
                variant="outline"
                className="w-full justify-start gap-3 mt-4"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="w-5 h-5" />
                Login
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default MainNav;
