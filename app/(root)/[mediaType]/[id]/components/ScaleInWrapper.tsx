"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type ScaleInWrapperProps = {
  children: ReactNode;
};

const ScaleInWrapper = ({ children }: ScaleInWrapperProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default ScaleInWrapper;
