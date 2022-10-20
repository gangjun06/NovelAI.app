import { CheckIcon, TagIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { forwardRef } from "react";

interface Props
  extends Omit<
    React.PropsWithoutRef<JSX.IntrinsicElements["div"]>,
    "onChange"
  > {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  selectedLeft?: React.ReactNode;
  unselectedLeft?: React.ReactNode;
}

export const Tag = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      selected,
      disabled = false,
      onSelect,
      className,
      selectedLeft,
      unselectedLeft,
      ...props
    },
    ref
  ) => {
    const leftElement = selected
      ? selectedLeft || (
          <CheckIcon
            width={20}
            height={20}
            className={classNames(
              "block",
              disabled ? "dark:text-gray-200 text-gray-600" : "text-primary-600"
            )}
          />
        )
      : unselectedLeft || (
          <TagIcon
            width={20}
            height={20}
            className={classNames(
              "block",
              disabled ? "dark:text-gray-200 text-gray-600" : "dark:text-white"
            )}
          />
        );
    return (
      <div
        className={classNames(
          "border shadow-sm rounded-full flex max-w-fit gap-x-1 items-center dark:bg-zinc-800 dark:border-gray-600 bg-white pl-2",
          !disabled &&
            (selected
              ? "border-primary-300 dark:border-primary-600"
              : "border-base-light dark:border-gray-600"),
          !disabled &&
            "hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer",
          className
        )}
        onClick={disabled ? undefined : onSelect}
        ref={ref}
        {...props}
      >
        {leftElement}
        <span
          className={classNames(
            disabled ? "text-gray-500" : "text-gray-800 dark:text-gray-200",
            "py-0.5 pr-2 text-ellipsis"
          )}
        >
          {label}
        </span>
      </div>
    );
  }
);

Tag.displayName = "Tag";
