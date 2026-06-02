"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { portfolioData } from "@/lib/data/portfolio";
import Link from "next/link";
import { FaArrowRight, FaCheck, FaQuoteLeft } from "react-icons/fa";

export default function SamplesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <header className="relative pt-24 pb-20 lg:pt-28 lg:pb-32 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border text-foreground font-bold text-[10px] mb-6 uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Proven Track Record
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground"
          >
            Engineering <span className="text-primary">Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore our portfolio of high-performance digital products, enterprise systems, and scalable architectures.
          </motion.p>
        </div>
      </header>
      
      <main className="py-20 bg-card relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-12"
          >
            {portfolioData.map((project, i) => {
              const gradients = [
                "from-blue-600/20 to-cyan-600/20",
                "from-emerald-600/20 to-teal-600/20",
                "from-rose-600/20 to-pink-600/20",
                "from-purple-600/20 to-indigo-600/20",
                "from-orange-600/20 to-amber-600/20",
              ];
              const bgGradient = gradients[i % gradients.length];
              
              return (
              <motion.div key={project.id} variants={itemVariants} className="group bg-background border border-border rounded-none overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                {/* Visual Header Graphic */}
                <div className={`w-full h-24 sm:h-32 bg-gradient-to-br ${bgGradient} relative overflow-hidden flex items-center justify-center border-b border-border`}>
                  <div className="absolute inset-0 bg-background/50 group-hover:bg-transparent transition-colors duration-500" />
                  <div className="absolute -bottom-8 -right-4 text-[100px] sm:text-[120px] font-black text-foreground/10 group-hover:text-foreground/5 transition-colors duration-500 pointer-events-none select-none leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>

                <div className="p-8 lg:p-12 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    <div className="flex-1 relative z-10">
                      <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">{project.category}</div>
                      <h3 className="text-3xl font-extrabold text-foreground mb-8 leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                      
                      <div className="mb-8">
                        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">The Challenge</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">{project.problem}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">Our Solution</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">{project.solution}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-muted/30 p-6 lg:p-8 border border-border rounded-none flex flex-col justify-between relative z-10 group-hover:bg-muted/50 transition-colors">
                      <div>
                        <h4 className="text-xs font-bold text-foreground mb-5 uppercase tracking-wider">Key Results</h4>
                        <ul className="space-y-4 mb-8">
                          {project.results.map((result, idx) => (
                            <li key={idx} className="flex items-start text-sm text-foreground font-medium group-hover:text-foreground/90 transition-colors">
                              <FaCheck className="text-primary mt-1 mr-3 shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-6 border-t border-border">
                        <FaQuoteLeft className="text-primary/20 text-3xl mb-3" />
                        <p className="text-sm italic text-muted-foreground mb-4 leading-relaxed">"{project.testimonial.quote}"</p>
                        <div>
                          <div className="font-bold text-foreground text-sm">{project.testimonial.author}</div>
                          <div className="text-xs text-primary font-medium mt-1">{project.testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )})}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <Button size="lg" className="rounded-none px-10 py-6 font-bold hover:scale-105 transition-transform text-base" asChild>
              <Link href="/contact-us">Start Your Project</Link>
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
