import { CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import React, { forwardRef, ReactElement } from "react";
import { darkModeAtom } from "./DarkModeToggle";

interface Props extends React.PropsWithoutRef<JSX.IntrinsicElements["div"]> {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  ignoreDisabled?: boolean;
  left?: () => JSX.Element;
}

export const Tag = forwardRef<HTMLDivElement, Props>(
  (
    {
      label,
      selected,
      disabled = false,
      ignoreDisabled = false,
      onSelect,
      className,
      left: Left,
      ...props
    },
    ref
  ) => {
    const darkMode = useAtomValue(darkModeAtom);

    return (
      <div
        className={classNames(
          "border shadow-sm rounded-full pl-2 flex max-w-fit gap-x-1 items-center",
          darkMode ? "bg-zinc-800 border-gray-600" : "bg-white",
          darkMode
            ? !disabled && (selected ? "border-primary-300" : "border-gray-600")
            : !disabled &&
                (selected ? "border-primary-300" : "border-gray-300"),
          darkMode
            ? !disabled && " hover:bg-gray-700 cursor-pointer"
            : !disabled && " hover:bg-gray-100 cursor-pointer",

          className
        )}
        onClick={
          (ignoreDisabled || !disabled) && selected ? onSelect : undefined
        }
        ref={ref}
        {...props}
      >
        {selected && (
          <CheckIcon
            width={20}
            height={20}
            className={classNames(
              "block",
              darkMode
                ? disabled
                  ? "text-gray-200"
                  : "text-primary-600"
                : disabled
                ? "text-gray-600"
                : "text-primary-600"
            )}
          />
        )}
        {Left && <Left />}
        <span
          className={classNames(
            darkMode
              ? disabled
                ? "text-gray-500"
                : "text-gray-200"
              : disabled
              ? "text-gray-500"
              : "text-gray-800",
            "py-0.5, pr-2"
          )}
          onClick={
            (ignoreDisabled || !disabled) && !selected ? onSelect : undefined
          }
        >
          {label}
        </span>
      </div>
    );
  }
);

Tag.displayName = "Tag";
