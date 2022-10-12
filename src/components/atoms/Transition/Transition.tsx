import type { ReactNode } from "react";
import {
  Transition as TransitionUI,
  TransitionClasses,
} from "@headlessui/react";

type TransitionTypes = "opacity" | "size";

const TransitionList: { [key in TransitionTypes]: TransitionClasses } = {
  size: {
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0 scale-95",
    enterTo: "transform opacity-100 scale-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100 scale-100",
    leaveTo: "transform opacity-0 scale-95",
  },
  opacity: {
    enter: "transition ease-out duration-100",
    enterFrom: "transform opacity-0",
    enterTo: "transform opacity-100",
    leave: "transition ease-in duration-75",
    leaveFrom: "transform opacity-100",
    leaveTo: "transform opacity-0",
  },
};

interface TransitionProps {
  children: ReactNode;
  type?: TransitionTypes;
  show?: boolean;
  appear?: boolean;
}

export const Transition = ({
  children,
  type = "opacity",
  show,
  appear,
}: TransitionProps) => {
  return (
    <TransitionUI
      as="div"
      show={show}
      appear={appear}
      {...TransitionList[type]}
    >
      {children}
    </TransitionUI>
  );
};
