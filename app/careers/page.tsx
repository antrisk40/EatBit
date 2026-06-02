"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";

export default function CareersPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const jobs = [
    { title: "Business Development Associate", location: "Remote", type: "Full-Time", dept: "Sales", link: "/careers/bda" },
  ];

  return (
    <>
      <header className="relative pt-32 pb-24 bg-card border-b border-border overflow-hidden">
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-orange-900/30 text-primary font-semibold text-sm mb-6 border border-orange-800"
          >
            We're Hiring
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground"
          >
            Join the <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">EatBit</span> Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Help us build digestible, scalable technology for the world's fastest-growing businesses.
          </motion.p>
        </div>
      </header>
      
      <main className="py-20 bg-background relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Open Positions</h2>
              <p className="text-muted-foreground mt-2">Come do the best work of your life.</p>
            </div>
            <div className="hidden sm:block text-muted-foreground">
              {jobs.length} roles available
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {jobs.map((job, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">work</span> {job.dept}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">location_on</span> {job.location}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">schedule</span> {job.type}</span>
                      </div>
                    </div>
                    <div>
                      <Link href={job.link}>
                        <Button variant="outline" className="w-full md:w-auto rounded-none group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                          Apply Now <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center p-12 bg-card rounded-none border border-border"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">Don't see a fit?</h3>
            <p className="text-muted-foreground mb-8">We're always looking for talented folks. Send your resume to our talent pool!</p>
            <Button size="lg" className="rounded-none px-8 shadow-lg shadow-primary/20">Drop Resume</Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}


