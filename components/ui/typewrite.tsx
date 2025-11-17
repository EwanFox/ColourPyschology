import { motion } from "framer-motion";

type Props = {
  text: string;
  speed?: number; // seconds per letter
  rkey: string; 
};

export default function TypewriterText({ text, speed = 0.05, rkey }: Props) {
  const lines = text.split("\n");

  const container = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: speed } },
  };

  const child = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex w-full flex-col items-center font-sans dark:bg-black" key={rkey}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex}>
          {line.split("").map((char, i) => (
            <motion.span key={i} variants={child}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
