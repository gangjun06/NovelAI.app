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
          <UISwitch.Label className="font-medium">{label}</UISwitch.Label>
          <UISwitch
            {...props}
            name={name}
            onChange={() => onChange(!checked)}
            checked={checked}
            ref={ref}
            className={classNames(
              checked ? "bg-primary-900" : "bg-primary-700",
              "relative inline-flex h-[30px] w-[54px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
            )}
          >
            <div className="slider" />
            <span
              aria-hidden="true"
              className={classNames(
                checked ? "translate-x-6" : "translate-x-0",
                "pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
              )}
            />
          </UISwitch>
        </div>
      </UISwitch.Group>
    );
  }
);

Switch.displayName = "Switch";
