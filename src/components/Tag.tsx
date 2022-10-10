import { CheckIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface Props {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

export const Tag = ({ label, selected, disabled, onSelect }: Props) => {
  return (
    <div
      className={classNames(
        "bg-white border shadow-sm rounded-full px-2 py-0.5 flex max-w-fit gap-x-1 items-center ",
        !disabled && (selected ? "border-primary-300" : "border-gray-300"),
        !disabled && " hover:bg-gray-100 cursor-pointer"
      )}
      onClick={onSelect}
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
      <div className={disabled ? "text-gray-500" : "text-gray-800"}>
        {label}
      </div>
    </div>
  );
};
