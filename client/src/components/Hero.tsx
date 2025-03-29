import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const handleSmoothScroll = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="hero" className="pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bringing Your{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Ideas
              </span>{" "}
              to Life with Animation
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Create stunning web experiences with smooth animations, creative transitions, and
              interactive elements that engage your audience.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll("#contact");
                }}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-medium text-center relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </a>
              <a
                href="#showcase"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll("#showcase");
                }}
                className="bg-white border border-gray-200 hover:border-primary text-gray-800 px-8 py-3 rounded-full font-medium text-center flex items-center justify-center group"
              >
                <span>View Examples</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-2">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  alt="Creative design dashboard"
                  className="rounded-xl w-full shadow-lg"
                />
              </div>

              <motion.div
                className="absolute -top-5 -right-5 w-24 h-24 bg-green-500/10 rounded-full"
                {...useParallax(0.05)}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/10 rounded-full"
                {...useParallax(-0.03)}
              />
              <motion.div
                className="absolute top-1/4 -left-6 w-12 h-12 bg-purple-500/10 rounded-full"
                {...useParallax(0.07)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-green-500/10 to-transparent rounded-full blur-3xl -z-10"
        {...useParallax(0.02)}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/10 to-transparent rounded-full blur-3xl -z-10"
        {...useParallax(-0.02)}
      />
    </section>
  );
}
