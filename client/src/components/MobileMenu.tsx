import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "wouter";

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
};

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35 }}
          className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold">Menu</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close menu">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                className="py-2 border-b border-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  setTimeout(() => {
                    const element = document.querySelector(link.href);
                    if (element) {
                      window.scrollTo({
                        top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                        behavior: "smooth",
                      });
                    }
                  }, 300);
                }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          <div className="mt-8 flex flex-col space-y-3">
            <Link 
              href="/animation-test"
              className="block text-center border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-full font-medium transition-colors"
              onClick={onClose}
            >
              Animation Demo
            </Link>
            <a
              href="#contact"
              className="block text-center bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-medium transition-all relative overflow-hidden group"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                setTimeout(() => {
                  const element = document.querySelector("#contact");
                  if (element) {
                    window.scrollTo({
                      top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                      behavior: "smooth",
                    });
                  }
                }, 300);
              }}
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
