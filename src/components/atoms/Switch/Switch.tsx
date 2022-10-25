import React, { forwardRef } from "react";
import { Switch as UISwitch } from "@headlessui/react";
import classNames from "classnames";

export interface SwitchProps
  extends Omit<
    React.PropsWithoutRef<JSX.IntrinsicElements["button"]>,
    "onChange" | "value"
  > {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, name, onChange, checked, ...props }, ref) => {
    return (
      <UISwitch.Group>
        <div className={classNames("flex items-center gap-3")}>
          <UISwitch.Label className="text-sm text-base-color">
            {label}
          </UISwitch.Label>
          <UISwitch
            {...props}
            name={name}
            onChange={() => onChange(!checked)}
            checked={checked}
            ref={ref}
            className={classNames(
              checked
                ? "bg-primary-400 dark:bg-primary600"
                : "bg-primary-200 dark:bg-primary-800",
              "relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
            )}
          >
            <div className="slider" />
            <span
              aria-hidden="true"
              className={classNames(
                checked ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              )}
            />
          </UISwitch>
        </div>
      </UISwitch.Group>
    );
  }
);

Switch.displayName = "Switch";
