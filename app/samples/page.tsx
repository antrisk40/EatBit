"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default function SamplesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
  };

  const projects = [
    { title: "Solar Savings App", category: "Web App", bg: "from-blue-900/40 to-cyan-900/40" },
    { title: "Fintech Dashboard", category: "Dashboards", bg: "from-emerald-900/40 to-teal-900/40" },
    { title: "E-Commerce Mobile App", category: "Mobile Apps", bg: "from-rose-900/40 to-pink-900/40" },
    { title: "SaaS Landing Page", category: "Websites", bg: "from-purple-900/40 to-indigo-900/40" },
    { title: "Healthcare CRM", category: "Enterprise", bg: "from-slate-900/40 to-gray-900/40" },
    { title: "Real Estate Portal", category: "Websites", bg: "from-orange-900/40 to-amber-900/40" },
  ];

  return (
    <>
      <header className="relative pt-32 pb-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground"
          >
            Project Samples
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A gallery of elegant, scalable solutions we've baked for our clients.
          </motion.p>
        </div>
      </header>
      
      <main className="py-20 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, i) => (
              <motion.div key={i} variants={itemVariants} className="group cursor-pointer">
                <div className={`relative h-64 rounded-2xl mb-4 overflow-hidden bg-gradient-to-br ${project.bg} border border-border flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  <motion.div 
                    initial={{ scale: 1 }} 
                    whileHover={{ scale: 1.1 }} 
                    className="w-20 h-20 rounded-xl bg-background/50 backdrop-blur text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary mb-1 uppercase tracking-wide">{project.category}</div>
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <Button size="lg" className="rounded-xl px-10 font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
              Load More Projects
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
