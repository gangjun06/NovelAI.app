import classNames from "classnames";
import { forwardRef, ReactNode } from "react";

interface StyleProps {
  variant?: "primary" | "default" | "subtle" | "light";
  compact?: boolean;
  forIcon?: boolean;
}

interface DefaultProps extends StyleProps {
  children: string | ReactNode;
}

const btnClassNames = (
  { compact, variant, forIcon }: StyleProps,
  { disabled, active }: { disabled?: boolean; active?: boolean },
  otherClasses?: string
) =>
  classNames(
    "transition text-black rounded flex-none text-center",
    {
      "px-4 py-1.5": !compact && !forIcon,
      "px-2 py-1": compact && !forIcon,
      "px-1 py-1": forIcon,
      "bg-gray-100 text-gray-400 dark:bg-zinc-700": disabled,
      "shadow-sm": variant !== "subtle",
      "bg-white hover:bg-gray-100 border border-base-light dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:border-base-dark dark:text-white":
        !disabled && variant === "default",
      "bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white":
        !disabled && variant === "primary",
      "bg-primary-300/50 text-primary-600 hover:bg-primary-400/50 dark:bg-primary-700/50 dark:text-primary-300 dark:hover:bg-primary-600/50":
        !disabled && variant === "light",
      "hover:bg-primary-300/50 text-primary-600 hover:dark:bg-primary-700/50 dark:text-primary-300":
        !disabled && variant === "subtle",
      "bg-primary-300/50 dark:bg-primary-700/50":
        !disabled && variant === "subtle" && active,
      // : "hover:bg-primary-300/40 hover:text-primary-500"
    },
    otherClasses
  );

type ButtonProps = React.PropsWithoutRef<JSX.IntrinsicElements["button"]> &
  DefaultProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "default",
      forIcon,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        className={btnClassNames(
          { compact, variant, forIcon },
          { disabled: props.disabled },
          className
        )}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

type ButtonLinkProps = React.PropsWithoutRef<JSX.IntrinsicElements["a"]> &
  DefaultProps & { active?: boolean };

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      variant = "default",
      compact = false,
      className,
      forIcon,
      active,
      ...props
    },
    ref
  ) => {
    return (
      <a
        ref={ref}
        {...props}
        className={btnClassNames(
          { compact, variant, forIcon },
          { active },
          className
        )}
      >
        {children}
      </a>
    );
  }
);

ButtonLink.displayName = "ButtonLInk";
