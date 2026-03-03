"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";


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

  const services = [
    {
      title: "Web Development",
      iconName: "code",
      desc: "Our core strength. We craft robust, scalable, and secure web applications using modern frameworks like React, Vue, and Node.js.",
      features: ["Full-Stack Solutions", "Progressive Web Apps (PWA)", "API Integration"],
      action: "Explore Web Dev",
      comingSoon: false,
    },
    {
      title: "UI/UX Design",
      iconName: "draw",
      desc: "We design intuitive interfaces that users love. Our process involves deep research, wireframing, and high-fidelity prototyping.",
      features: ["User Research", "Wireframing & Prototyping", "Design Systems"],
      action: "See Our Designs",
      comingSoon: false,
    },
    {
      title: "Mobile Development",
      iconName: "smartphone",
      desc: "Native and cross-platform mobile applications that provide seamless experiences on iOS and Android devices.",
      features: ["React Native / Flutter", "iOS & Android Native", "App Store Optimization"],
      action: "View Mobile Apps",
      comingSoon: false,
    },
    {
      title: "E-commerce",
      iconName: "shopping_bag",
      desc: "Turn visitors into customers. We build custom online stores using Shopify, WooCommerce, or bespoke solutions.",
      features: ["Custom Storefronts", "Payment Gateway Integration", "Inventory Management"],
      action: "Start Selling",
      comingSoon: false,
    },
    {
      title: "AI & Machine Learning",
      iconName: "hub",
      desc: "We are preparing to help businesses leverage the power of data through intelligent algorithms and predictive models.",
      progress: 75,
      comingSoon: true,
    },
    {
      title: "Cloud & DevOps",
      iconName: "cloud",
      desc: "Upcoming services to streamline deployment and ensure your infrastructure is scalable, reliable, and automated.",
      progress: 50,
      comingSoon: true,
    }
  ];

  return (
    <>
      <header className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32 bg-background-light dark:bg-background-dark">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold text-sm mb-6 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Innovating Digital Solutions
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground">
            We Build The <span className="text-primary relative inline-block">
              Future
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
              </svg>
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
            From pixel-perfect UI designs to scalable backend architectures. EatBit consumes complexity and delivers simplicity.
          </p>
        </motion.div>
      </header>

      <main className="flex-grow bg-card py-20 relative border-t border-border">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Our Expertise</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Tailored technology services designed to bite-size your biggest challenges.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((svc, i) => (
              <motion.div key={i} variants={itemVariants} className={`group bg-background border border-border rounded-2xl p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${svc.comingSoon ? 'opacity-90' : ''}`}>
                {!svc.comingSoon && <div className="absolute top-0 left-0 w-1 h-full bg-primary" />}
                {svc.comingSoon && (
                  <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                    Coming Soon
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${svc.comingSoon ? 'bg-muted' : 'bg-primary/10 group-hover:bg-primary'}`}>
                  <span className={`material-symbols-outlined text-[32px] ${svc.comingSoon ? 'text-muted-foreground' : 'text-primary group-hover:text-white'}`}>{svc.iconName}</span>
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 transition-colors ${svc.comingSoon ? 'text-muted-foreground' : 'text-foreground group-hover:text-primary'}`}>
                  {svc.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 flex-grow">{svc.desc}</p>
                
                {!svc.comingSoon ? (
                  <>
                    <ul className="space-y-2 mb-8">
                      {svc.features?.map((feat, j) => (
                        <li key={j} className="flex items-center text-sm text-muted-foreground">
                          <span className="text-primary mr-2 md:text-base">•</span> {feat}
                        </li>
                      ))}
                    </ul>
                    <a className="inline-flex items-center text-primary font-semibold hover:gap-2 transition-all group-hover:translate-x-1" href="#">
                        {svc.action} <span className="material-symbols-outlined text-[20px] ml-1">arrow_forward</span>
                    </a>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 mb-8">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/50 rounded-full" style={{ width: `${svc.progress}%` }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground">Development in progress: {svc.progress}%</p>
                    </div>
                    <span className="inline-flex items-center text-muted-foreground font-semibold cursor-not-allowed">
                        Notify Me <span className="material-symbols-outlined text-[20px] ml-1">notifications</span>
                    </span>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <section className="bg-background py-20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to take a bite out of your next project?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Let's discuss how EatBit can help you achieve your digital goals. Our team is ready to deliver excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full px-8 py-6 font-bold text-lg shadow-lg hover:shadow-orange-500/30 text-primary-foreground transition-all">
                Get a Quote
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 font-bold text-lg border-2 hover:bg-secondary hover:text-white transition-all">
                View Portfolio
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
