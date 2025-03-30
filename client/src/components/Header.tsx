import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.97)"]
  );

  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 1px 3px rgba(0,0,0,0.05)", "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > 100) {
        if (currentScrollTop > lastScrollTop) {
          setShouldHideHeader(true);
        } else {
          setShouldHideHeader(false);
        }
      } else {
        setShouldHideHeader(false);
      }

      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm z-50"
        style={{
          backgroundColor: headerBackground,
          boxShadow: headerShadow,
          transform: shouldHideHeader ? "translateY(-100%)" : "translateY(0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-2xl font-bold flex items-center">
              <span className="text-primary">Anim</span>
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">ate</span>
            </a>

            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="font-medium relative group"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    if (element) {
                      window.scrollTo({
                        top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  {link.label}
                  <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <a
                href="#contact"
                className="hidden md:block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-all relative overflow-hidden group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector("#contact");
                  if (element) {
                    window.scrollTo({
                      top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} navLinks={navLinks} />
    </>
  );
}
