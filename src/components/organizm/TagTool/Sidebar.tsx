import { Disclosure } from "@headlessui/react";
import { ArchiveBoxIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Tag } from "~/components/atoms";
import { Menu } from "~/components/molecule";

export const Sidebar = () => {
  return (
    <div className="shadow-inner border-l border-base-color bg-[#fafafa] dark:bg-zinc-800 px-4 py-4">
      <h2 className="text-2xl text-title-color mb-4 font-bold flex gap-x items-center gap-x-2">
        <ArchiveBoxIcon className="h-6 w-6" />
        <p>보관함</p>
      </h2>
      <Disclosure
        as="div"
        className="border border-base-color bg-white dark:bg-zinc-800/50 px-2 py-2 rounded-lg"
      >
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center gap-x-2">
              <ChevronUpIcon
                className={classNames(
                  `h-5 w-5`,
                  open ? "rotate-180 transform" : ""
                )}
              />
              <span>What is your refund policy?</span>
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-2 pb-2">
              <Menu>
                <Menu.Button>
                  <Tag label={"Hello"} disabled={false} selected={false} />
                </Menu.Button>
                <Menu.Dropdown>
                  <Menu.Item icon={ArchiveBoxIcon}>Save</Menu.Item>
                  <Menu.Item icon={ArchiveBoxIcon}>Hello</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
