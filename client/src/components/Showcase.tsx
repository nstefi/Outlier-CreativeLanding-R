import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";

const showcaseItems = [
  {
    title: "Modern E-commerce Experience",
    description: "Product showcases with smooth transitions and interactive elements.",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    label: "E-commerce Animations",
  },
  {
    title: "Data Visualization Dashboard",
    description: "Animated charts and metrics with smooth data loading states.",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    label: "Dashboard Interface",
  },
  {
    title: "Immersive Travel Experience",
    description: "Destination showcases with parallax scrolling and image transitions.",
    image:
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80",
    label: "Travel Website",
  },
];

export default function Showcase() {
  const { ref, controls } = useScrollAnimation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="showcase" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            ref={ref}
          >
            See It in Action
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
          >
            Explore real-world examples of how our animation library brings websites to life.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              className="group rounded-xl overflow-hidden shadow-md"
              variants={item}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-medium">{item.label}</span>
                </div>
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <a
                  href="#"
                  className="text-primary font-medium inline-flex items-center group/link"
                >
                  <span>View case study</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={item}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.6 }}
        >
          <a
            href="#"
            className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-primary text-gray-800 px-8 py-3 rounded-full font-medium group"
          >
            <span>View all case studies</span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
