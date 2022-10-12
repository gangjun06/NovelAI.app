import classNames from "classnames";
import { forwardRef, ReactNode } from "react";

interface Props extends React.PropsWithoutRef<JSX.IntrinsicElements["button"]> {
  children: string | ReactNode;
  variant?: "primary" | "default";
  compact?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    { children, variant = "default", compact = false, className, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={classNames(
          "transition text-black rounded shadow-sm flex-none",
          {
            "px-4 py-1.5": !compact,
            "px-2 py-1": compact,
            "bg-gray-100 text-gray-400 dark:bg-zinc-700": props.disabled,
            "bg-white hover:bg-gray-100 border border-base-light dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:border-base-dark dark:text-white":
              !props.disabled && variant === "default",
            "bg-primary-600 hover:bg-primary-700 text-white":
              !props.disabled && variant === "primary",
          },
          className
        )}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
