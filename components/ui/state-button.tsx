import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type ButtonState = "idle" | "loading";

interface AnimatedButtonProps {
  idleText: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onClick?: () => Promise<boolean> | void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  state?: ButtonState;
}

export function AnimatedButton({
  idleText = "Submit",
  loadingText = "Submitting...",
  variant = "default",
  size = "default",
  className,
  disabled = false,
  type = "button",
  state,
}: AnimatedButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      type={type}
      className={`${className} transition-all duration-300`}
      disabled={disabled || state === "loading"}
    >
      <motion.div
        className="flex items-center gap-2"
        layout
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30 },
          duration: 0.1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={state}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {state === "loading" ? loadingText : idleText}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </Button>
  );
}
