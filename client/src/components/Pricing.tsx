import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check, X } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small projects and personal websites.",
    features: [
      { name: "Core animation library", included: true },
      { name: "Basic transitions & effects", included: true },
      { name: "Email support", included: true },
      { name: "Advanced animations", included: false },
      { name: "Custom solutions", included: false },
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    description: "Ideal for businesses and larger projects.",
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Advanced animations & effects", included: true },
      { name: "Priority email support", included: true },
      { name: "Custom animation creation", included: true },
      { name: "Dedicated support", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "For large organizations with complex needs.",
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Unlimited projects", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Custom solutions & integrations", included: true },
      { name: "Service level agreement", included: true },
    ],
    popular: false,
  },
];

export default function Pricing() {
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
    <section id="pricing" className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            ref={ref}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.1 }}
          >
            Choose the plan that fits your project needs with no hidden fees.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`flex-1 ${
                plan.popular ? "border-2 border-primary" : "border border-gray-200"
              } rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-md hover:-translate-y-2`}
              variants={item}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                </div>
              )}
              <div className={`p-8 ${plan.popular ? "bg-primary/5" : "bg-gray-50"}`}>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featIndex) => (
                    <li key={featIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="text-green-500 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <X className="text-gray-400 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll("#contact");
                  }}
                  className={`block text-center ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "border border-primary text-primary hover:bg-primary hover:text-white"
                  } px-6 py-3 rounded-full font-medium transition-all relative overflow-hidden group`}
                >
                  <span className="relative z-10">
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </span>
                  {plan.popular && (
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  )}
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute -top-8 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
