"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden flex-1">
        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-muted rounded-full blur-3xl opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
            
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center lg:text-left mb-12 lg:mb-0">
              <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-2 rounded-full bg-orange-900/30 border border-orange-800 text-primary font-medium text-sm mb-6">
                <span className="material-symbols-outlined text-[16px] mr-2">rocket_launch</span>
                Launching businesses into the future
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-foreground">
                Bite-Sized Tech, <br/>
                <span className="bg-gradient-to-r from-primary to-orange-400 gradient-text text-transparent">Giant Results.</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                We transform complex technical challenges into digestible, elegant solutions. From web development to digital strategy, EatBit is your partner in growth.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="rounded-xl font-bold text-lg px-8 py-6 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 gap-2 hover:scale-105 transition-all">
                  Start Your Project
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Button>
                <Button variant="outline" size="lg" className="bg-background rounded-xl font-bold text-lg px-8 py-6 gap-2 group hover:border-primary/50 transition-all">
                  <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">play_circle</span>
                  View Our Work
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.4, duration: 0.8 }} 
              className="relative lg:h-[600px] flex items-center justify-center"
            >
              <div className="relative w-full max-w-md animate-float">
                <Card className="rounded-2xl shadow-2xl relative z-20 border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">EatBit Dashboard</div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 bg-muted rounded-xl flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-orange-800/20"></div>
                        <div className="w-24 h-24 rounded-full border-8 border-primary/20 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary shadow-lg"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-muted rounded-xl p-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-900/30 text-blue-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-[16px]">code</span>
                          </div>
                          <div className="h-2 w-12 bg-gray-700 rounded mb-1"></div>
                          <div className="h-2 w-8 bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-24 bg-muted rounded-xl p-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-900/30 text-orange-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                          </div>
                          <div className="h-2 w-12 bg-gray-700 rounded mb-1"></div>
                          <div className="h-2 w-8 bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-24 bg-muted rounded-xl p-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-900/30 text-purple-500 flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                          </div>
                          <div className="h-2 w-12 bg-gray-700 rounded mb-1"></div>
                          <div className="h-2 w-8 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <motion.div 
                  initial={{ rotate: -45, scale: 0 }} 
                  animate={{ rotate: 12, scale: 1 }} 
                  transition={{ delay: 1, type: "spring" }} 
                  className="absolute -top-6 -right-6 w-20 h-20 bg-foreground rounded-xl shadow-xl flex items-center justify-center z-30 transform"
                >
                  <span className="text-3xl">🚀</span>
                </motion.div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ delay: 1.2 }} 
                  className="absolute -bottom-8 -left-8 bg-card p-4 rounded-xl shadow-xl border border-border z-30 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-500">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Project Done</div>
                    <div className="text-xs text-muted-foreground">Ahead of schedule</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-card transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Flavorful Solutions for Your Business</h3>
            <p className="max-w-2xl mx-auto text-muted-foreground">
                We don't just write code; we bake success into every pixel. Here is what sets EatBit apart from the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all hover:shadow-lg group"
            >
              <div className="w-14 h-14 rounded-xl bg-orange-900/30 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">monitoring</span>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Rapid Delivery</h4>
              <p className="text-muted-foreground leading-relaxed">
                  We use agile methodologies to deliver bite-sized updates frequently, ensuring your project moves fast without breaking.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all hover:shadow-lg group"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-900/30 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">draw</span>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Custom Recipes</h4>
              <p className="text-muted-foreground leading-relaxed">
                  No cookie-cutter templates. We design unique solutions tailored specifically to your brand's taste and needs.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all hover:shadow-lg group"
            >
              <div className="w-14 h-14 rounded-xl bg-green-900/30 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">security</span>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Ironclad Security</h4>
              <p className="text-muted-foreground leading-relaxed">
                  We bake security into the core of our development process, protecting your data like a secret family recipe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* From Concept to Code */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 order-2 lg:order-1 relative"
            >
              <img alt="Team working on design" className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[500px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrNufvj9Lx5nfDzd320mG88l9qZIZAMoovyuCzZAYJCkjLHaykIS9h7uRBVGvOaDHzbWGG5h6Z5viLfxrT-fFLXg-l7fAx8HoOJyGY-wfdshlZaNh1ZU7EXjGP-FYs57qcfE66QXoSSPIG9NjkZwy9SVvXAeYoRpoYOYbshOVcNliOPkpQ67rUGEN5zDiXTmzPXrrFCAaHy6yVVqWAcYC5eXGoh_TWSAtD_DPBBHa1AW75cS5mPLBOT7ZNk2HO_yv3ggwUk8FTz4g5"/>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-48 bg-card rounded-2xl shadow-xl z-20 p-6 border border-border hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">1</div>
                  <div className="h-1 flex-1 bg-muted rounded-full">
                    <div className="w-1/2 h-full bg-primary rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">2</div>
                </div>
                <h5 className="text-foreground font-bold text-lg mb-2">Design Phase</h5>
                <p className="text-muted-foreground text-sm">Crafting the perfect user interface with attention to every pixel.</p>
              </div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>

            <div className="lg:col-span-7 order-1 lg:order-2 mb-12 lg:mb-0 pl-0 lg:pl-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Our Approach</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">From Concept to Code</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                    We bridge the gap between imagination and reality. Our seamless design-to-development workflow ensures that what you see is exactly what you get.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  {
                    step: '1', title: 'Discovery & Strategy', desc: 'We start by understanding your hunger. We analyze your market, users, and goals to create a strategic menu.'
                  },
                  {
                    step: '2', title: 'UI/UX Design', desc: 'Our chefs cook up visually stunning and intuitive interfaces that users love to consume.'
                  },
                  {
                    step: '3', title: 'Development & Launch', desc: 'We bake the code to perfection using modern frameworks, ensuring a crisp, bug-free launch.'
                  }
                ].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * (i + 1) }}
                    key={item.step} 
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-orange-900/30 text-primary flex items-center justify-center font-bold">{item.step}</div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take a bite?</h2>
          <p className="text-xl text-gray-300 mb-10">Join hundreds of satisfied clients who have tasted success with EatBit tech services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-xl font-bold text-lg px-10 py-6 shadow-lg shadow-orange-500/30 hover:-translate-y-1 transition-transform">
                Get a Quote
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white/20 hover:bg-white/10 text-white rounded-xl font-bold text-lg px-10 py-6 transition-all">
                Browse Services
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
