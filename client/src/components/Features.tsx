import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Code,
  Zap,
  Layout,
  Accessibility,
  MousePointerClick,
} from "lucide-react";

const features = [
  {
    icon: <MousePointerClick className="text-2xl text-primary" />,
    title: "Smooth Transitions",
    description:
      "Create fluid page transitions and element animations that respond naturally to user interactions.",
    color: "primary",
  },
  {
    icon: <Layout className="text-2xl text-green-500" />,
    title: "Scroll Animations",
    description:
      "Trigger engaging animations as users scroll through your content for an interactive storytelling experience.",
    color: "green",
  },
  {
    icon: <Code className="text-2xl text-purple-500" />,
    title: "Easy Integration",
    description:
      "Implement animations quickly with our library that works seamlessly with modern frameworks like React, Vue, and Angular.",
    color: "purple",
  },
  {
    icon: <Zap className="text-2xl text-yellow-500" />,
    title: "Performance Optimized",
    description:
      "Enjoy smooth animations that don't impact page performance with our optimized rendering engine.",
    color: "yellow",
  },
  {
    icon: <LayoutTemplate className="text-2xl text-pink-500" />,
    title: "Responsive Design",
    description:
      "Animations adapt perfectly to any screen size, ensuring consistent experiences across all devices.",
    color: "pink",
  },
  {
    icon: <Accessibility className="text-2xl text-red-500" />,
    title: "Accessibility First",
    description:
      "All animations respect user preferences, including reduced motion settings for inclusive web experiences.",
    color: "red",
  },
];

export default function Features() {
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
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            ref={ref}
          >
            Powerful Animation Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
          >
            Craft beautiful experiences with our comprehensive animation toolkit designed for modern web applications.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-2"
              variants={item}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-6`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
