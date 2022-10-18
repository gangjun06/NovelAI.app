import { Provider, useAtom } from "jotai";
import React, { Fragment, ReactElement, ReactNode, useEffect } from "react";
import { Menu as MenuUI, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Props {
  children: ReactNode;
}

export const Menu = ({ children }: Props) => {
  return (
    <MenuUI as="div" className="relative inline-block text-left">
      {children}
    </MenuUI>
  );
};

const Button = ({ children }: { children: ReactNode }) => {
  return <MenuUI.Button as={React.Fragment}>{children}</MenuUI.Button>;
};

const Dropdown = ({ children }: { children: ReactNode }) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuUI.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1">{children}</div>
      </MenuUI.Items>
    </Transition>
  );
};

interface ItemProps {
  icon: (
    props: React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>
  ) => JSX.Element;
  onClick?: () => void;
  children: string;
}

const Item = ({ icon: Icon, onClick, children }: ItemProps) => {
  return (
    <MenuUI.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active ? "bg-primary-500 text-white" : "text-gray-900"
          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          <Icon className="mr-2 h-5 w-5 text-primary-400" aria-hidden="true" />
          {children}
        </button>
      )}
    </MenuUI.Item>
  );
};

Menu.Button = Button;
Menu.Dropdown = Dropdown;
Menu.Item = Item;