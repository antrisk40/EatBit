"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

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
      title: "Bite-Sized",
      price: "$2,500",
      description: "Perfect for startups needing a quick, professional MVP.",
      features: ["Single Page Application (SPA)", "Basic UI/UX Design", "Standard Support", "1 Revision Cycle"],
      popular: false
    },
    {
      title: "Main Course",
      price: "$7,500",
      description: "The complete package for growing businesses.",
      features: ["Full-Stack Next.js App", "Custom UI/UX Design System", "Priority Support", "Authentication Setup", "Database Integration"],
      popular: true
    },
    {
      title: "Feast",
      price: "Custom",
      description: "Enterprise solutions for massive scaling.",
      features: ["Cloud & DevOps Setup", "Dedicated Development Team", "24/7 Premium Support", "AI/ML Integration", "Unlimited Revisions"],
      popular: false
    }
  ];

  return (
    <>
      <header className="relative pt-32 pb-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
          >
            Service Plans & Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Transparent pricing tailored for every appetite. Choose the plan that perfectly sizes up your operations.
          </motion.p>
        </div>
      </header>
      
      <main className="py-20 bg-card relative">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {plans.map((plan, i) => (
              <motion.div key={i} variants={itemVariants} className="h-full">
                <Card className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${plan.popular ? 'border-primary shadow-lg shadow-orange-500/10' : 'border-border'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 border-b border-border">
                    <CardTitle className="text-2xl font-bold mb-2">{plan.title}</CardTitle>
                    <div className="text-4xl font-extrabold text-foreground">{plan.price}</div>
                    <CardDescription className="mt-4 text-muted-foreground">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-muted-foreground">
                          <span className="material-symbols-outlined text-primary text-[20px] mr-3 flex-shrink-0">check_circle</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button 
                      className="w-full font-bold h-12 rounded-xl" 
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Choose {plan.title}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </>
  );
}
