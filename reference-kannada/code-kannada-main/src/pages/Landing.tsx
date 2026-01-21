import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, BookOpen, Users, HelpCircle, LogIn, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code2,
      title: "ಕೋಡ್ ಮಾಡಿ",
      subtitle: "Start Coding",
      description: "Write algorithms in Kannada and convert to Python",
      path: "/code",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: BookOpen,
      title: "ಟ್ಯುಟೋರಿಯಲ್ಸ್",
      subtitle: "Tutorials",
      description: "Learn programming concepts in your native language",
      path: "/tutorials",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: HelpCircle,
      title: "ಕ್ವಿಜ್‌ಗಳು",
      subtitle: "Quizzes",
      description: "Test your knowledge with interactive quizzes",
      path: "/quizzes",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Users,
      title: "ನಮ್ಮ ಬಗ್ಗೆ",
      subtitle: "About Us",
      description: "Meet the team behind KannadaCoder",
      path: "/about",
      color: "bg-success/10 text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        
        {/* Decorative patterns */}
        <div className="absolute top-10 right-20 opacity-10">
          <GraduationCap className="w-32 h-32 text-primary" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-10">
          <Sparkles className="w-24 h-24 text-secondary" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground">KalikeMate</h1>
            <p className="text-xs text-muted-foreground font-kannada">ಕಲಿಕೆ ಮೇಟ್</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {features.map((feature) => (
            <Button
              key={feature.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(feature.path)}
              className="gap-2"
            >
              <feature.icon className="w-4 h-4" />
              {feature.subtitle}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="ml-2 gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Interactive Learning Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="font-kannada text-gradient">ಕಲಿಕೆ</span>
            <span className="text-foreground">Mate</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-kannada text-muted-foreground mb-4">
            ಕನ್ನಡದಲ್ಲಿ ಕೋಡಿಂಗ್ ಕಲಿಯಿರಿ
          </p>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Learn programming in your native language. Write algorithms in Kannada and watch them transform into executable Python code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={() => navigate("/code")}>
              <Code2 className="w-5 h-5" />
              Start Coding
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/login")}>
              <LogIn className="w-5 h-5" />
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full px-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate(feature.path)}
              className="glass-effect rounded-2xl p-6 cursor-pointer group hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-kannada text-xl font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-primary mb-2">{feature.subtitle}</p>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center"
        >
          {[
            { value: "500+", label: "Students" },
            { value: "50+", label: "Tutorials" },
            { value: "100+", label: "Quizzes" },
          ].map((stat, index) => (
            <div key={index} className="px-4">
              <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 KalikeMate - Bridging Language Barriers in Coding Education
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
