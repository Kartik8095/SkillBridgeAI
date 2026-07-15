import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedInputProps {
  name: string;
  icon: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  direction: "left" | "right";
  rightIcon?: ReactNode;
}

function AnimatedInput({
  name,
  icon,
  type,
  placeholder,
  value,
  onChange,
  direction,
  rightIcon,
}: AnimatedInputProps) {
  return (
    <motion.div
      className="animated-input"
      initial={{
        x: direction === "left" ? -700 : 700,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: direction === "left" ? 0.1 : 0.3,
      }}
      whileHover={{
        scale: 1.02,
        y: -3,
      }}
    >
      <div className="left-icon">{icon}</div>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      <div className="right-icon">{rightIcon}</div>
    </motion.div>
  );
}

export default AnimatedInput;