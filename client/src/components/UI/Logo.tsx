import { motion } from "framer-motion";

function Logo() {
  return (
    <motion.div
      className="logo"
      initial={{
        y: -120,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 1,
        type: "spring",
      }}
    >
      <h1>🚀 SkillBridge AI</h1>

      <p>AI Powered Resume Analyzer</p>
    </motion.div>
  );
}

export default Logo;