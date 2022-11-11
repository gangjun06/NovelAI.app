import { forwardRef, ReactNode } from 'react'
import classNames from 'classnames'

interface StyleProps {
  variant?: 'primary' | 'default' | 'subtle' | 'light'
  compact?: boolean
  forIcon?: boolean
  loading?: boolean
}

interface DefaultProps extends StyleProps {
  children: string | ReactNode
}

export const btnClassNames = (
  { compact, variant, forIcon }: StyleProps,
  { disabled, active }: { disabled?: boolean; active?: boolean },
  otherClasses?: string,
) =>
  classNames(
    'btn transition text-black rounded flex-none text-center border flex gap-x-3 items-center justify-center',
    {
      'px-4 py-1.5': !compact && !forIcon,
      'px-2 py-1': compact && !forIcon,
      'px-1 py-1': forIcon,
      'bg-gray-100 text-gray-400 dark:bg-zinc-700 border-base-color': disabled,
      'shadow-sm': variant !== 'subtle',
      'bg-white hover:bg-gray-100 border-base-light dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:border-base-dark dark:text-white':
        !disabled && variant === 'default',
      'bg-primary-500 hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white border-transparent':
        !disabled && variant === 'primary',
      'bg-primary-300/50 text-primary-600 hover:bg-primary-400/50 dark:bg-primary-700/50 dark:text-primary-300 dark:hover:bg-primary-600/50 border-transparent':
        !disabled && variant === 'light',
      'hover:bg-primary-300/50 text-primary-600 hover:dark:bg-primary-700/50 dark:text-primary-300 border-transparent':
        !disabled && variant === 'subtle',
      'bg-primary-300/50 dark:bg-primary-700/50 border-transparent':
        !disabled && variant === 'subtle' && active,
      // : "hover:bg-primary-300/40 hover:text-primary-500"
    },
    otherClasses,
  )

type ButtonProps = React.PropsWithoutRef<JSX.IntrinsicElements['button']> & DefaultProps

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'default',
      forIcon,
      compact = false,
      className,
      loading = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        {...props}
        disabled={props.disabled || loading}
        className={btnClassNames(
          { compact, variant, forIcon },
          { disabled: props.disabled },
          className,
        )}
      >
        {loading && (
          <>
            {/*Refference: Tailwind CSS: https://tailwindcss.com/docs/animation */}
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </>
        )}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

type ButtonLinkProps = React.PropsWithoutRef<JSX.IntrinsicElements['a']> &
  DefaultProps & { active?: boolean }

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { children, variant = 'default', compact = false, className, forIcon, active, ...props },
    ref,
  ) => {
    return (
      <a
        ref={ref}
        {...props}
        className={btnClassNames({ compact, variant, forIcon }, { active }, className)}
      >
        {children}
      </a>
    )
  },
)

ButtonLink.displayName = 'ButtonLInk'
