import { CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { forwardRef, ReactElement } from "react";

interface Props extends React.PropsWithoutRef<JSX.IntrinsicElements["div"]> {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  left?: () => JSX.Element;
}

export const Tag = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      selected,
      disabled = false,
      onSelect,
      className,
      left: Left,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          "bg-white border shadow-sm rounded-full pl-2 flex max-w-fit gap-x-1 items-center",
          !disabled && (selected ? "border-primary-300" : "border-gray-300"),
          !disabled && " hover:bg-gray-100 cursor-pointer",
          className
        )}
        onClick={!disabled && selected ? onSelect : undefined}
        ref={ref}
        {...props}
      >
        {selected && (
          <CheckIcon
            width={20}
            height={20}
            className={classNames(
              "block",
              disabled ? "text-gray-600" : "text-primary-600"
            )}
          />
        )}
        {Left && <Left />}
        <span
          className={classNames(
            disabled ? "text-gray-500" : "text-gray-800",
            "py-0.5, pr-2"
          )}
          onClick={!disabled && !selected ? onSelect : undefined}
        >
          {label}
        </span>
      </div>
    );
  }
);

Tag.displayName = "Tag";
