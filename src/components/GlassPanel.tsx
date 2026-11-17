import { forwardRef, type ElementType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cx } from "../lib/cx";
import { spring } from "../lib/motion";

type GlassPanelProps = {
  as?: ElementType;
  tone?: "default" | "strong";
  className?: string;
  children?: ReactNode;
} & Record<string, any>;

/**
 * One glass surface for the whole site: navbar, cards, buttons and the modal.
 * The visual definition lives in `.glass-panel` / `.glass-panel-strong`.
 */
export const GlassPanel = forwardRef<HTMLElement, GlassPanelProps>(
  function GlassPanel(
    { as = "div", tone = "default", className, children, ...rest },
    ref,
  ) {
    const Tag: any = as;

    return (
      <Tag
        ref={ref}
        className={cx(
          "glass-panel",
          tone === "strong" && "glass-panel-strong",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

type GlassButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "primary";
  size?: "md" | "lg";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
};

export function GlassButton({
  children,
  className,
  variant = "glass",
  size = "md",
  ...rest
}: GlassButtonProps) {
  return (
    <GlassPanel
      as={motion.button}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className={cx(
        "group/btn relative cursor-pointer select-none overflow-hidden rounded-full font-medium text-white/85",
        "transition-colors duration-300 hover:text-white",
        size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-sm",
        variant === "primary" && "glass-panel-strong text-white",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))",
        }}
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </GlassPanel>
  );
}
