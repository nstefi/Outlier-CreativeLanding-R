import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { usePreferredReducedMotion } from "@/hooks/usePreferredReducedMotion";

export default function Home() {
  const prefersReducedMotion = usePreferredReducedMotion();

  // Smooth scrolling for anchor links
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId as string);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      <div className="overflow-x-hidden">
        <PageLoader />
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <Clients />
          <Features />
          <Showcase />
          <Pricing />
          <Testimonials />
          <Contact />
        </motion.main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}
