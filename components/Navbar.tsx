"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `font-medium transition-colors ${
      isActive 
        ? "text-primary underline decoration-2 underline-offset-8" 
        : "text-muted-foreground hover:text-primary"
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/EatBit.svg" alt="EatBit Logo" width={40} height={40} />
              <span className="font-bold text-2xl tracking-tight">
                <span className="text-primary">Eat</span><span className="text-foreground">Bit</span>
              </span>
            </Link>
          </motion.div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link className={getLinkClass("/services")} href="/services">Services</Link>
            <Link className={getLinkClass("/plans")} href="/plans">Plans</Link>
            <Link className={getLinkClass("/samples")} href="/samples">Samples</Link>
            <Link className={getLinkClass("/tools")} href="/tools/gemini-watermark-remover">🛠 Tools</Link>
            <Link className={getLinkClass("/careers")} href="/careers">Careers</Link>
            <Link className={getLinkClass("/contact-us")} href="/contact-us">Contact Us</Link>
            <Button className="rounded-none shadow-lg shadow-orange-500/30 w-[140px] font-semibold transition-transform hover:scale-105" asChild>
              <Link href="/contact-us">Get Started</Link>
            </Button>
            <ModeToggle />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}



