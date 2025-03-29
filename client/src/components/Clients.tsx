import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const clients = [
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/320px-Google_2015_logo.svg.png",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/320px-Microsoft_logo.svg.png",
  },
  {
    name: "Facebook",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Facebook_Logo_%282019%29.svg/320px-Facebook_Logo_%282019%29.svg.png",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/256px-Apple_logo_black.svg.png",
  },
];

export default function Clients() {
  const { ref, controls } = useScrollAnimation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          variants={item}
          animate={controls}
          ref={ref}
        >
          <p className="text-gray-500 font-medium">Trusted by innovative companies worldwide</p>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          variants={container}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              variants={item}
            >
              <img src={client.logo} alt={client.name} className="h-8 md:h-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
