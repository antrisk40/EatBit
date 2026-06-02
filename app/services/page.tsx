"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { servicesData } from "@/lib/data/services";
import Link from "next/link";
import { FaArrowRight, FaCheck } from "react-icons/fa";

export default function ServicesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <>
      <header className="relative overflow-hidden pt-24 pb-20 lg:pt-28 lg:pb-32 bg-background border-b border-border">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border text-foreground font-bold text-[10px] mb-6 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            End-To-End Enterprise Engineering
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
            Custom Solutions Built for <span className="text-primary">Scale</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed">
            From high-performance web applications to advanced AI integrations, we engineer robust digital products that drive operational efficiency and market dominance.
          </p>
        </motion.div>
      </header>

      <main className="flex-grow bg-card py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {servicesData.map((svc, i) => (
              <motion.div key={svc.id} variants={itemVariants} className="group bg-background border border-border rounded-none p-8 flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
                {/* Background Numbering Graphic */}
                <div className="absolute -right-8 -top-8 text-[150px] font-black text-muted/30 group-hover:text-primary/10 transition-colors duration-500 pointer-events-none select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-2xl font-extrabold mb-4 text-foreground group-hover:text-primary transition-colors relative z-10">
                  {svc.title}
                </h3>
                
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed line-clamp-4 relative z-10">
                  {svc.description}
                </p>
                
                <div className="mb-8 relative z-10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Core Capabilities</h4>
                  <ul className="space-y-3">
                    {svc.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors">
                        <FaCheck className="text-primary mt-1 mr-3 shrink-0" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto pt-6 border-t border-border flex flex-wrap gap-2 relative z-10">
                  {svc.industries.map((ind, k) => (
                    <span key={k} className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded-none border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                      {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <section className="bg-background py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Architect Your Next Big Move?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Let's discuss how our engineering team can build a tailored solution for your exact requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="rounded-none font-bold px-8 py-6 shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                <Link href="/contact-us">Start a Project</Link>
            </Button>
            <Button variant="outline" className="bg-background rounded-none font-bold px-8 py-6 gap-2 group hover:border-primary/50 transition-all" asChild>
                <Link href="/samples">View Case Studies <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
