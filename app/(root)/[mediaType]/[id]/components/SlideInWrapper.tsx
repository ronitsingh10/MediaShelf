"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type SlideInWrapperProps = {
  children: ReactNode;
};

const SlideInWrapper = ({ children }: SlideInWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};

export default SlideInWrapper;
