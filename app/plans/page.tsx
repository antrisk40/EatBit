"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function PlansPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const plans = [
    {
      title: "Simple WordPress Site",
      price: "5,000",
      description: "Professional, responsive websites perfect for establishing your digital presence.",
      features: ["Custom Theme Setup", "Responsive UI Design", "Basic SEO Optimization", "Contact Form Integration", "1 Month Support"],
      image: "/plans/laptop.webp",
      popular: false,
      cta: "Get Started"
    },
    {
      title: "E-Commerce + Admin",
      price: "25,000",
      description: "Complete online store with an admin dashboard to manage products and orders.",
      features: ["Full E-Commerce Engine", "Custom Admin Dashboard", "Payment Gateway Integration", "Inventory Management", "3 Months Support"],
      image: "/plans/dashboard.webp",
      popular: true,
      cta: "Build E-Commerce"
    },
    {
      title: "Custom Software",
      price: "Contact Us",
      description: "Bespoke SaaS, mobile apps, or enterprise software built entirely from scratch.",
      features: ["Tailored Architecture", "Advanced UI/UX Design System", "Cloud Infrastructure Setup", "API & Database Development", "Dedicated Support SLA"],
      image: "/plans/clients.webp",
      popular: false,
      cta: "Discuss Requirements"
    }
  ];

  return (
    <>
      <main className="pt-32 pb-20 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-foreground tracking-tight">Our Plans</h1>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {plans.map((plan, i) => {
              const gradients = [
                "from-blue-600/10 via-cyan-600/5 to-transparent",
                "from-primary/20 via-primary/5 to-transparent",
                "from-purple-600/10 via-indigo-600/5 to-transparent",
              ];
              const bgGradient = gradients[i % gradients.length];
              
              return (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <Card className={`relative h-full flex flex-col rounded-none transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-background overflow-hidden group ${plan.popular ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-border hover:border-primary/50'}`}>
                  {/* Subtle Background Glow */}
                  <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${bgGradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-none text-[10px] font-bold uppercase tracking-widest border border-primary z-20">
                      Industry Standard
                    </div>
                  )}

                  {/* Header Image Slot */}
                  <div className="relative w-full h-48 sm:h-56 border-b border-border overflow-hidden bg-muted">
                    <Image 
                      src={plan.image} 
                      alt={plan.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                  </div>
                  
                  <CardHeader className="text-center pt-8 pb-8 border-b border-border relative z-10">
                    <CardTitle className="text-2xl font-bold mb-2 tracking-tight group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                    <div className="text-4xl font-extrabold text-foreground tracking-tighter relative inline-block">
                      {plan.price !== "Contact Us" && <span className="text-xl align-top mr-1 font-sans">₹</span>}
                      {plan.price}
                      <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                    </div>
                    <CardDescription className="mt-4 text-muted-foreground text-sm font-medium">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pt-8 px-6 lg:px-8 bg-muted/10 relative z-10 group-hover:bg-transparent transition-colors duration-500">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-foreground font-medium group-hover:text-foreground/90 transition-colors">
                          <FaCheck className="text-primary text-[14px] mt-1 mr-3 flex-shrink-0" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="pt-6 pb-8 px-6 lg:px-8 bg-muted/10 border-t border-border mt-auto relative z-10 group-hover:bg-transparent transition-colors duration-500">
                    <Button 
                      className="w-full font-bold h-12 rounded-none uppercase tracking-wider text-xs shadow-none group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-500" 
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/contact-us">{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </main>
    </>
  );
}
