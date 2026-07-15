import { motion } from "framer-motion";

interface Props {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function AnimatedButton({
  text,
  onClick,
  disabled = false,
}: Props) {
  return (
    <motion.button
      className="animated-button"
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {text}
    </motion.button>
  );
}

export default AnimatedButton;