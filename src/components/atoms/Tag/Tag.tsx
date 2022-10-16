import { CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { forwardRef } from "react";
import { Switch } from "@headlessui/react";

interface Props
  extends Omit<
    React.PropsWithoutRef<JSX.IntrinsicElements["button"]>,
    "onChange"
  > {
  label: string;
  selected?: boolean;
  onChange?: (state: boolean) => void;
}

export const Tag = forwardRef<HTMLButtonElement, Props>(
  (
    {
      label,
      selected,
      disabled = false,
      onChange,
      className,
      value: _value,
      ...props
    },
    ref
  ) => {
    const handle = () => {
      if (typeof onChange === "function") onChange(!selected);
    };

    return (
      <Switch
        as="button"
        checked={selected}
        onChange={() => handle()}
        className={classNames(
          "border shadow-sm rounded-full pl-2 flex max-w-fit gap-x-1 items-center dark:bg-zinc-800 dark:border-gray-600 bg-white",
          {
            "hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer":
              !disabled,
            "border-primary-300": !disabled && selected,
            "border-base-light dark:border-gray-600": !disabled && !selected,
          },
          className
        )}
        {...props}
      >
        {selected && (
          <CheckIcon
            width={20}
            height={20}
            className={classNames(
              "block",
              disabled ? "dark:text-gray-200 text-gray-600" : "text-primary-600"
            )}
          />
        )}
        <span
          className={classNames(
            disabled ? "text-gray-500" : "text-gray-800 dark:text-gray-200",
            "py-0.5, pr-2"
          )}
        >
          {label}
        </span>
      </Switch>
    );
  }
);

Tag.displayName = "Tag";
