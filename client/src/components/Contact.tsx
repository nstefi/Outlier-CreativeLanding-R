import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, PhoneCall, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(5, { message: "Message is required" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { ref, controls } = useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                ref={ref}
              >
                Get in Touch
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                transition={{ delay: 0.1 }}
              >
                Have questions or ready to transform your website? Reach out to our team today.
              </motion.p>

              <motion.div
                className="space-y-6"
                variants={container}
                initial="hidden"
                animate={controls}
                ref={ref}
              >
                <motion.div className="flex items-start" variants={item}>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mr-4">
                    <Mail className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <p className="text-gray-600">Our friendly team is here to help.</p>
                    <a
                      href="mailto:hello@animate.com"
                      className="text-primary font-medium mt-1 inline-block"
                    >
                      hello@animate.com
                    </a>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" variants={item}>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 mr-4">
                    <PhoneCall className="text-green-500 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
                    <a
                      href="tel:+1234567890"
                      className="text-primary font-medium mt-1 inline-block"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </motion.div>

                <motion.div className="flex items-start" variants={item}>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mr-4">
                    <MapPin className="text-purple-500 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                    <p className="text-gray-600">Come say hello at our office.</p>
                    <p className="text-gray-600 mt-1">123 Animation St, San Francisco, CA 94107</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              transition={{ delay: 0.4 }}
              ref={ref}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="font-semibold text-xl mb-6">Send us a message</h3>

                <div className="mb-6">
                  <Label htmlFor="name" className="block text-gray-700 mb-2">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className={`w-full ${
                      errors.name ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <Label htmlFor="email" className="block text-gray-700 mb-2">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full ${
                      errors.email ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="mb-6">
                  <Label htmlFor="message" className="block text-gray-700 mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="How can we help you?"
                    className={`w-full resize-none ${
                      errors.message ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-medium transition-all relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}
