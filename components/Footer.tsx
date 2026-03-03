import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Image src="/EatBit.svg" alt="EatBit Logo" width={32} height={32} />
              <span className="font-bold text-xl text-foreground">EatBit</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Making technology easy to digest for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Mobile Apps</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">UI/UX Design</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Consulting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                neeleshbaghel40@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                +91 8319212779
              </li>
            </ul>
            <div className="mt-6 flex gap-4">
              <a className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all" href="https://www.linkedin.com/in/antrisk40/">
                <span className="font-bold">in</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 EatBit Tech Services. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
