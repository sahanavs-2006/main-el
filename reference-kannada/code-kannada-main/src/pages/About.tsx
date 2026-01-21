import { motion } from "framer-motion";
import { Users, Mail, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainNav from "@/components/MainNav";

const teamMembers = [
  {
    name: "Goutami Sooda",
    role: "Project Lead",
    class: "MTech CSE",
    year: "2024",
    description: "Passionate about making coding accessible to everyone through regional languages. Leads the NLP model development and system architecture.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=goutami&backgroundColor=b6e3f4",
  },
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    class: "BTech CSE",
    year: "2024",
    description: "Expert in React and UI/UX design. Creates beautiful and intuitive interfaces that make learning enjoyable.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya&backgroundColor=ffd5dc",
  },
  {
    name: "Rahul Kumar",
    role: "Backend Developer",
    class: "MTech AI/ML",
    year: "2024",
    description: "Specializes in Django and API development. Ensures seamless integration between frontend and AI models.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul&backgroundColor=c0aede",
  },
  {
    name: "Ananya Rao",
    role: "ML Engineer",
    class: "BTech CSE",
    year: "2025",
    description: "Works on fine-tuning the CodeT5 model for Kannada to Python translation. Passionate about NLP research.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya&backgroundColor=d1d4f9",
  },
  {
    name: "Karthik Hegde",
    role: "Content Creator",
    class: "BTech ISE",
    year: "2024",
    description: "Creates comprehensive tutorials and quiz content in Kannada. Ensures educational materials are accurate and engaging.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=karthik&backgroundColor=ffdfbf",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <MainNav />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            ನಮ್ಮ ಬಗ್ಗೆ
          </h1>
          <p className="text-xl text-primary font-medium mb-4">About Us</p>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate team behind KalikeMate - dedicated to breaking language barriers in programming education for rural students.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect rounded-3xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            In the modern world, programming abilities—including critical thinking and problem-solving—are essential. 
            However, students in rural areas frequently lack access to high-quality instructional resources, 
            particularly in programming, because internet materials are primarily written in English. 
            They also encounter linguistic obstacles. We aim to overcome these language hurdles and give 
            rural students fair access to programming, analytical thinking, and logical reasoning education 
            through this web application that teaches programming in Kannada.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="glass-effect rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {member.role}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {member.class} • Class of {member.year}
              </p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {member.description}
              </p>

              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Github className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <Button variant="hero" size="lg">
              <Mail className="w-4 h-4" />
              Contact Us
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default About;
