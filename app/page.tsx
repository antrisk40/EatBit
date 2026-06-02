"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { servicesData } from "@/lib/data/services";
import { portfolioData } from "@/lib/data/portfolio";
import { faqData, blogTopics, usps, localSeo } from "@/lib/data/faqs-blogs";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiExpress, SiNestjs, SiPython, SiAndroid, SiIos, SiSwift, SiPostgresql, SiMongodb, SiRedis, SiMysql, SiDocker, SiGooglecloud, SiOpenai } from "react-icons/si";
import { FaAws, FaLaptopCode, FaMobileAlt, FaRobot, FaCloud, FaDatabase, FaCogs, FaShoppingCart, FaHospital, FaHamburger, FaPaintBrush, FaStar, FaCode, FaUsers, FaLock, FaRocket, FaHandshake, FaChartLine, FaSearch, FaClipboardList, FaBug, FaHeadset, FaMapMarkerAlt, FaQuoteRight, FaChevronDown, FaArrowRight, FaServer, FaCheck } from "react-icons/fa";

const getUspIcon = (idx: number) => {
   const icons = [
      <FaServer color="#3B82F6" size={24} />,
      <FaUsers color="#10B981" size={24} />,
      <FaPaintBrush color="#EC4899" size={24} />,
      <FaRocket color="#F59E0B" size={24} />,
      <FaLock color="#6366F1" size={24} />,
      <FaChartLine color="#14B8A6" size={24} />,
      <FaMobileAlt color="#8B5CF6" size={24} />,
      <FaRobot color="#EF4444" size={24} />,
      <FaHandshake color="#F97316" size={24} />,
      <FaCode color="#06B6D4" size={24} />,
   ];
   return icons[idx] || <FaStar color="#F59E0B" size={24} />;
};

const getServiceIcon = (id: string) => {
   switch(id) {
      case 'custom-web-development': return <FaLaptopCode color="#3B82F6" />;
      case 'nextjs-development': return <SiNextdotjs color="currentColor" />;
      case 'react-development': return <SiReact color="#61DAFB" />;
      case 'nodejs-development': return <SiNodedotjs color="#339933" />;
      case 'mobile-app-development': return <FaMobileAlt color="#10B981" />;
      case 'react-native-development': return <SiReact color="#61DAFB" />;
      case 'ai-development': return <FaRobot color="#8B5CF6" />;
      case 'ai-chatbot-development': return <SiOpenai color="currentColor" />;
      case 'saas-development': return <FaCloud color="#F59E0B" />;
      case 'mvp-development': return <FaCogs color="#EF4444" />;
      case 'ecommerce-development': return <FaShoppingCart color="#EC4899" />;
      case 'erp-development': return <FaDatabase color="#6366F1" />;
      case 'crm-development': return <FaCogs color="#06B6D4" />;
      case 'healthcare-software': return <FaHospital color="#10B981" />;
      case 'food-delivery': return <FaHamburger color="#F97316" />;
      case 'devops-cloud': return <FaCloud color="#3B82F6" />;
      case 'api-development': return <FaCogs color="#8B5CF6" />;
      case 'ui-ux-design': return <FaPaintBrush color="#EC4899" />;
      default: return <FaLaptopCode color="#3B82F6" />;
   }
};

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

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
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-24 lg:pt-28 pb-20 lg:pb-32 overflow-hidden flex-1 border-b border-border bg-transparent">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-12 gap-16 items-center">
               
               {/* Left Column: Text & CTAs */}
               <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-5 text-center lg:text-left mb-16 lg:mb-0">
                  <motion.div variants={itemVariants} className="inline-flex items-center px-3 py-1.5 rounded-none bg-muted border border-border text-foreground font-bold text-[10px] mb-6 uppercase tracking-wider">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                     TRUSTED BY STARTUPS, SMEs & GROWING BUSINESSES
                  </motion.div>
                  
                  <motion.h1 variants={itemVariants} className="text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4 text-foreground">
                     Custom Software, Websites & Mobile Apps That Help Businesses <span className="text-primary">Grow Faster</span>
                  </motion.h1>
                  
                  <motion.p variants={itemVariants} className="text-base text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                     From high-converting websites to enterprise software and AI-powered applications, EatBit helps businesses automate operations, generate more leads, and scale without technology becoming a bottleneck.
                  </motion.p>
                  
                  {/* Checkmarks */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 text-xs sm:text-sm font-medium text-foreground text-left max-w-xl mx-auto lg:mx-0">
                     <div className="flex items-center justify-center sm:justify-start gap-2"><FaCheck className="text-primary shrink-0" /> 250+ Projects Delivered</div>
                     <div className="flex items-center justify-center sm:justify-start gap-2"><FaCheck className="text-primary shrink-0" /> 98% Client Retention</div>
                     <div className="flex items-center justify-center sm:justify-start gap-2"><FaCheck className="text-primary shrink-0" /> Clients Across 20+ Countries</div>
                     <div className="flex items-center justify-center sm:justify-start gap-2"><FaCheck className="text-primary shrink-0" /> Dedicated Development Teams</div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                     <Button className="rounded-none font-bold px-6 py-5 shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                        <Link href="/contact-us">Get Free Consultation</Link>
                     </Button>
                     <Button variant="outline" className="bg-background rounded-none font-bold px-6 py-5 gap-2 group hover:border-primary/50 transition-all">
                        View Case Studies
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </motion.div>

                  {/* Helping Businesses Build */}
                  <motion.div variants={itemVariants} className="pt-4 border-t border-border">
                     <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Helping Businesses Build:</p>
                     <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-[11px] sm:text-xs font-medium text-foreground/80 max-w-2xl">
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> Business Websites</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> Web Applications</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> Mobile Apps</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> CRM & ERP Systems</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> E-commerce Platforms</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> AI Chatbots & Automation</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> SaaS Products</span>
                        <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-primary rounded-none"></span> Custom Enterprise Software</span>
                     </div>
                  </motion.div>
               </motion.div>

               {/* Right Column: Bento Box */}
               <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="lg:col-span-7"
               >
                  <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[500px] lg:h-[600px]">
                     {/* Large Team Image */}
                     <div className="col-span-12 sm:col-span-8 row-span-3 sm:row-span-4 bg-muted/80 rounded-none border border-border overflow-hidden flex flex-col items-center justify-center text-center shadow-sm relative group">
                        <Image src="/home/clients.webp" alt="Corporate Team Collaborating" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>

                     {/* Success Stat */}
                     <div className="col-span-6 sm:col-span-4 row-span-2 sm:row-span-3 bg-card rounded-none border border-border p-6 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full blur-xl"></div>
                        <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-3 relative z-10">
                           <FaChartLine size={20} />
                        </div>
                        <div className="text-4xl font-extrabold text-foreground mb-1 relative z-10">99%</div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest relative z-10">Delivery</p>
                     </div>

                     {/* Tech Stack Mini */}
                     <div className="col-span-6 sm:col-span-4 row-span-2 sm:row-span-3 bg-card rounded-none border border-border p-6 flex flex-col justify-center shadow-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-tr-full blur-xl"></div>
                        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><SiReact size={18}/></div>
                           <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><SiNodedotjs size={18}/></div>
                           <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500"><FaAws size={18}/></div>
                        </div>
                        <p className="text-sm font-bold text-foreground relative z-10">Enterprise Scale</p>
                        <p className="text-xs text-muted-foreground relative z-10">Modern Stack</p>
                     </div>

                     {/* Developer Mockup Space */}
                     <div className="col-span-12 sm:col-span-8 row-span-2 sm:row-span-2 bg-muted/80 rounded-none border border-border overflow-hidden flex items-center justify-center text-left shadow-sm group relative">
                        <Image src="/home/laptop.webp" alt="Dashboard UI Mockup" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                  </div>
               </motion.div>

            </div>
         </div>
      </section>

      {/* ----------------- CLIENT SUCCESS METRICS ----------------- */}
      <section className="py-12 bg-muted/50 border-b border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <div className="text-4xl font-bold text-primary mb-2">250+</div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Projects Delivered</p>
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Client Retention</p>
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <div className="text-4xl font-bold text-primary mb-2">15+</div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Industries Served</p>
               </motion.div>
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                  <div className="text-4xl font-bold text-primary mb-2">20+</div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Countries Served</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ----------------- SERVICES SECTION ----------------- */}
      <section className="py-24 bg-card">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Our Expertise</h2>
               <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Comprehensive Software Development Services</h3>
               <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                  As a leading <strong>custom software development company</strong>, we provide end-to-end digital solutions. From stunning UI/UX to robust enterprise backend systems, we have the technical prowess to bring your vision to life.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(showAllServices ? servicesData : servicesData.slice(0, 6)).map((service, index) => (
                  <motion.div 
                     key={service.id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: (index % 3) * 0.1 }}
                     className="bg-background rounded-none p-6 border border-border hover:border-primary/50 transition-colors shadow-sm group flex flex-col"
                  >
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-none bg-muted flex items-center justify-center text-foreground group-hover:scale-110 transition-transform text-2xl">
                           {getServiceIcon(service.id)}
                        </div>
                        <h4 className="text-xl font-bold leading-tight">{service.title}</h4>
                     </div>
                     <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {service.description}
                     </p>
                     
                     <details className="mt-auto group/details">
                        <summary className="text-primary text-sm font-semibold cursor-pointer hover:underline list-none [&::-webkit-details-marker]:hidden flex items-center gap-1">
                           <span>View Details</span>
                           <span className="material-symbols-outlined text-[16px] group-open/details:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="pt-4 mt-4 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2">
                           <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                           <div>
                              <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Key Benefits</h5>
                              <ul className="space-y-1">
                                 {service.benefits.map((benefit, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                       <span className="material-symbols-outlined text-green-500 text-[14px]">check</span>
                                       {benefit}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           <div className="pt-2">
                              <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Industries</h5>
                              <div className="flex flex-wrap gap-1">
                                 {service.industries.map((ind, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-muted rounded text-[10px] font-medium text-muted-foreground">
                                       {ind}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </details>
                  </motion.div>
               ))}
            </div>
            
            {!showAllServices && (
               <div className="mt-12 text-center">
                  <Button onClick={() => setShowAllServices(true)} variant="outline" size="lg" className="rounded-none px-8 border-primary/50 text-primary hover:bg-primary/10">
                     View All {servicesData.length} Services
                  </Button>
               </div>
            )}
         </div>
      </section>

      {/* ----------------- TECHNOLOGIES SECTION ----------------- */}
      <section className="py-24 bg-transparent border-y border-border overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Tech Stack</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-16">Technologies We Use</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { title: "Frontend Development", icon: "desktop_windows", tech: [{name: "React", Icon: SiReact, color: "#61DAFB"}, {name: "Next.js", Icon: SiNextdotjs, color: "currentColor"}, {name: "TypeScript", Icon: SiTypescript, color: "#3178C6"}, {name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4"}] },
                  { title: "Backend Development", icon: "dns", tech: [{name: "Node.js", Icon: SiNodedotjs, color: "#339933"}, {name: "Express.js", Icon: SiExpress, color: "currentColor"}, {name: "NestJS", Icon: SiNestjs, color: "#E0234E"}, {name: "Python", Icon: SiPython, color: "#3776AB"}] },
                  { title: "Mobile App Development", icon: "smartphone", tech: [{name: "React Native", Icon: SiReact, color: "#61DAFB"}, {name: "Android", Icon: SiAndroid, color: "#3DDC84"}, {name: "iOS", Icon: SiIos, color: "currentColor"}, {name: "Swift", Icon: SiSwift, color: "#F05138"}] },
                  { title: "Databases", icon: "database", tech: [{name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1"}, {name: "MongoDB", Icon: SiMongodb, color: "#47A248"}, {name: "Redis", Icon: SiRedis, color: "#DC382D"}, {name: "MySQL", Icon: SiMysql, color: "#4479A1"}] },
                  { title: "Cloud & DevOps", icon: "cloud", tech: [{name: "Docker", Icon: SiDocker, color: "#2496ED"}, {name: "AWS", Icon: FaAws, color: "#FF9900"}, {name: "Google Cloud", Icon: SiGooglecloud, color: "#4285F4"}, {name: "CI/CD", Icon: null, color: "currentColor"}] },
                  { title: "AI Development", icon: "smart_toy", tech: [{name: "OpenAI", Icon: SiOpenai, color: "currentColor"}, {name: "Gemini", Icon: null, color: "currentColor"}, {name: "LangChain", Icon: null, color: "currentColor"}, {name: "Vector DBs", Icon: null, color: "currentColor"}, {name: "RAG", Icon: null, color: "currentColor"}] },
               ].map((stack, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="p-6 rounded-none bg-card border border-border shadow-sm hover:shadow-lg transition-all text-left"
                  >
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-none bg-primary/20 text-primary flex items-center justify-center">
                           <span className="material-symbols-outlined">{stack.icon}</span>
                        </div>
                        <h4 className="text-xl font-bold">{stack.title}</h4>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {stack.tech.map((t, i) => (
                           <span key={i} className="px-3 py-1.5 bg-background border border-border rounded-none text-sm font-medium text-foreground flex items-center gap-2">
                              {t.Icon && <t.Icon className="text-[16px]" color={t.color} />}
                              {t.name}
                           </span>
                        ))}
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ----------------- OUR TEAM / CULTURE (NEW) ----------------- */}
      <section className="py-24 bg-transparent border-t border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="aspect-[4/3] bg-muted/80 rounded-none border border-border flex flex-col items-center justify-center relative overflow-hidden"
               >
                  <Image src="/home/candidates.webp" alt="EatBit team members collaborating in modern office" fill className="object-cover" />
               </motion.div>
               
               <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Our Culture</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Real People, Real Partnerships</h3>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                     Behind every flawless application and scalable backend is a team of dedicated, passionate individuals. We don't just write code; we deeply integrate with your business goals to ensure long-term success.
                  </p>
                  <ul className="space-y-4 mb-8">
                     <li className="flex items-center gap-3 text-foreground font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[16px]">groups</span></div>
                        Collaborative & Transparent Workflows
                     </li>
                     <li className="flex items-center gap-3 text-foreground font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[16px]">psychology</span></div>
                        Continuous Learning & Innovation
                     </li>
                  </ul>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ----------------- WHY CHOOSE US SECTION ----------------- */}
      <section className="py-24 bg-card">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Our Advantage</h2>
               <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why Choose EatBit</h3>
               <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
                  We stand out in the crowded landscape of <strong>software development companies</strong> by delivering uncompromising quality and true partnership.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
               {usps.map((usp, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.05 }}
                     className="bg-background p-6 rounded-none border border-border hover:border-primary transition-colors text-center lg:text-left flex flex-col items-center lg:items-start"
                  >
                     <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        {getUspIcon(idx)}
                     </div>
                     <h4 className="font-bold text-foreground mb-2 text-lg">{usp.title}</h4>
                     <p className="text-sm text-muted-foreground">{usp.description}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ----------------- DEVELOPMENT PROCESS ----------------- */}
      <section className="py-24 bg-transparent border-t border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">How We Work</h2>
               <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Proven Development Process</h3>
               <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
                  A structured, agile methodology ensures your digital product is delivered on time, within budget, and to the highest quality standards.
               </p>
            </div>

            <div className="relative">
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0"></div>
               <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 relative z-10">
                   {[
                     { title: "Discovery", desc: "Requirements gathering and market analysis.", color: "#3B82F6", Icon: FaSearch },
                     { title: "Planning", desc: "Architecture design and project roadmapping.", color: "#8B5CF6", Icon: FaClipboardList },
                     { title: "UI/UX Design", desc: "Wireframing and high-fidelity prototyping.", color: "#EC4899", Icon: FaPaintBrush },
                     { title: "Development", desc: "Agile coding with continuous integration.", color: "#10B981", Icon: FaCode },
                     { title: "Testing", desc: "Rigorous QA and performance testing.", color: "#EF4444", Icon: FaBug },
                     { title: "Deployment", desc: "Smooth launch to production environments.", color: "#F59E0B", Icon: FaRocket },
                     { title: "Support", desc: "Ongoing maintenance and iteration.", color: "#06B6D4", Icon: FaHeadset },
                  ].map((step, idx) => (
                     <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center text-center bg-card md:bg-transparent p-4 rounded-none border md:border-none border-border"
                     >
                        <div className="w-16 h-16 rounded-full text-white flex items-center justify-center mb-4 shadow-lg border-4 border-background z-10" style={{ backgroundColor: step.color, boxShadow: `0 4px 14px 0 ${step.color}40` }}>
                           <step.Icon size={24} />
                        </div>
                        <h4 className="font-bold text-foreground mb-2">{step.title}</h4>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ----------------- PORTFOLIO SHOWCASE ----------------- */}
      <section className="py-24 bg-card border-t border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Our Work</h2>
               <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Recent Case Studies</h3>
               <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
                  See how we've helped businesses achieve digital excellence through custom software development, mobile apps, and intelligent platforms.
               </p>
            </div>

            <div className="space-y-16">
               {(showAllPortfolio ? portfolioData : portfolioData.slice(0, 3)).map((item, idx) => (
                  <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center bg-background rounded-none p-8 lg:p-12 border border-border shadow-sm`}
                  >
                     <div className="flex-1 space-y-6">
                        <div className="inline-block px-3 py-1 rounded-none bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                           {item.category}
                        </div>
                        <h4 className="text-3xl font-bold text-foreground">{item.title}</h4>
                        
                        <div>
                           <h5 className="font-semibold text-lg mb-2 text-foreground">The Problem</h5>
                           <p className="text-muted-foreground leading-relaxed">{item.problem}</p>
                        </div>
                        
                        <div>
                           <h5 className="font-semibold text-lg mb-2 text-foreground">The Solution</h5>
                           <p className="text-muted-foreground leading-relaxed">{item.solution}</p>
                        </div>

                        <div>
                           <h5 className="font-semibold text-lg mb-2 text-foreground">Key Results</h5>
                           <ul className="space-y-2">
                              {item.results.map((res, i) => (
                                 <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                    <FaChartLine className="text-green-500 mt-1" size={16} />
                                    <span>{res}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                     
                     <div className="flex-1 w-full flex flex-col gap-6">
                        {/* Case Study Image */}
                        <div className="w-full h-48 sm:h-64 bg-muted/80 rounded-none border border-border flex flex-col items-center justify-center relative overflow-hidden group">
                           <Image src="/home/computer.webp" alt="App Mockup" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        <div className="bg-card p-8 rounded-none border border-border shadow-inner relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                           <FaQuoteRight className="text-primary/20 absolute top-4 right-4" size={48} />
                           <p className="text-lg italic text-foreground mb-6 relative z-10 leading-relaxed">
                              "{item.testimonial.quote}"
                           </p>
                           <div className="flex items-center gap-4 relative z-10">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                                 {item.testimonial.author.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-foreground">{item.testimonial.author}</div>
                                 <div className="text-sm text-muted-foreground">{item.testimonial.role}</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            {!showAllPortfolio && (
               <div className="mt-16 text-center">
                  <Button onClick={() => setShowAllPortfolio(true)} variant="outline" size="lg" className="rounded-none px-8 border-primary/50 text-primary hover:bg-primary/10">
                     View More Case Studies
                  </Button>
               </div>
            )}
         </div>
      </section>

      {/* ----------------- LOCAL SEO SECTION ----------------- */}
      <section className="py-16 bg-muted/30 border-y border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
               {localSeo.map((item, idx) => (
                  <div key={idx}>
                     <h4 className="font-bold text-foreground mb-2 flex flex-col sm:flex-row items-center lg:items-start gap-2">
                        <FaMapMarkerAlt className="text-red-500" size={20} />
                        {item.service} in {item.location}
                     </h4>
                     <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section className="py-24 bg-transparent">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Knowledge Base</h2>
               <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>
               <p className="text-muted-foreground text-lg">Everything you need to know about our software development services, processes, and expertise.</p>
            </div>

            <div className="space-y-4">
               {(showAllFaqs ? faqData : faqData.slice(0, 5)).map((faq, idx) => (
                  <div key={idx} className="border border-border rounded-none bg-card overflow-hidden">
                     <button 
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors focus:outline-none"
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                     >
                        <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                        <FaChevronDown className="text-primary transition-transform duration-300" style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                     </button>
                     <motion.div 
                        initial={false}
                        animate={{ height: activeFaq === idx ? 'auto' : 0, opacity: activeFaq === idx ? 1 : 0 }}
                        className="overflow-hidden"
                     >
                        <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border">
                           {faq.answer}
                        </div>
                     </motion.div>
                  </div>
               ))}
            </div>

            {!showAllFaqs && (
               <div className="mt-12 text-center">
                  <Button onClick={() => setShowAllFaqs(true)} variant="outline" className="rounded-none px-8 border-primary/50 text-primary hover:bg-primary/10">
                     Load All {faqData.length} FAQs
                  </Button>
               </div>
            )}
         </div>
      </section>

      {/* ----------------- BLOG / INSIGHTS SECTION ----------------- */}
      <section className="py-24 bg-card border-t border-border">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-3">Insights</h2>
               <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Latest from Our Tech Blog</h3>
               <p className="text-muted-foreground text-lg">Deep dives into software architecture, digital transformation, and modern web development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {blogTopics.slice(0, 4).map((topic, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-background rounded-none overflow-hidden border border-border hover:border-primary/50 transition-all cursor-pointer group flex flex-col"
                  >

                     <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                           <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Article</div>
                           <h4 className="font-bold text-foreground group-hover:text-primary transition-colors mb-4 line-clamp-3">
                              {topic}
                           </h4>
                        </div>
                        <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                           Read more <FaArrowRight className="ml-1" size={14} />
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
            <div className="mt-12 text-center">
               <Button variant="outline" className="rounded-none px-8">View All {blogTopics.length} Articles</Button>
            </div>
         </div>
      </section>

      {/* ----------------- FINAL CTA ----------------- */}
      <section className="py-24 bg-black text-white relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to Build Something <span className="text-primary">Extraordinary?</span></h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join industry leaders who trust EatBit as their premier software development company. Let's transform your vision into a scalable, high-performance digital product.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="rounded-none font-bold text-xl px-12 py-8 shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-transform" asChild>
                <Link href="/contact-us">
                    Get a Free Consultation
                </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white/20 hover:bg-white/10 text-white rounded-none font-bold text-xl px-12 py-8 transition-all" asChild>
                <Link href="/contact-us">
                    Contact Sales
                </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm text-gray-400">No commitment required. We sign NDAs instantly.</p>
        </motion.div>
      </section>
    </>
  );
}



