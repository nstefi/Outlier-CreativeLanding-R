import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, ArrowRight } from "lucide-react";

const testimonials = [
  {
    content:
      "The animation library completely transformed our website. Our engagement metrics increased by 40% within the first month of implementation.",
    author: "Sarah Johnson",
    role: "Marketing Director, TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    rating: 5,
  },
  {
    content:
      "The animations are not only beautiful but also performant. Our site loads quickly even with complex transitions, which was a game-changer for us.",
    author: "Michael Chen",
    role: "Lead Developer, CreativeAgency",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
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
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            ref={ref}
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
          >
            Hear from businesses that have transformed their web presence with our animation
            solutions.
          </motion.p>
        </div>

        <motion.div
          className="max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-2"
                variants={item}
              >
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-12" variants={item}>
            <a href="#" className="inline-flex items-center justify-center text-primary font-medium group">
              <span>Read more testimonials</span>
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-green-500/5 rounded-full -z-10"></div>
    </section>
  );
}
