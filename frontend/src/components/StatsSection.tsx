"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, Shield, MessageSquare } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Active Members" },
  { icon: ShoppingBag, value: "120K+", label: "Successful Trades" },
  { icon: Shield, value: "99.8%", label: "Security Rating" },
  { icon: MessageSquare, value: "25K+", label: "Active Vendors" },
];

const StatsSection = () => (
  <section className="border-t border-border bg-card py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
