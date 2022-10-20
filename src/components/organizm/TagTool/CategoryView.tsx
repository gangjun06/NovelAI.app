import { Disclosure } from "@headlessui/react";
import {
  ChevronDoubleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  RectangleStackIcon,
  ClipboardIcon,
  LockClosedIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  CheckIcon,
  PencilIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useAtom } from "jotai";
import { Button, Tag } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { Category, CategoryAtom, focusCategoryAtom } from "~/hooks/tagTool";

interface Props {
  categoryAtom: CategoryAtom;
  remove: () => void;
  duplicate: (value: Category) => void;
}

export const CategoryView = ({ categoryAtom, remove, duplicate }: Props) => {
  const [category, setCategory] = useAtom(categoryAtom);
  const [focusCategory, setFocusCategory] = useAtom(focusCategoryAtom);

  return (
    <Disclosure
      as="div"
      className="border border-base-color bg-white dark:bg-zinc-800/50 px-2 py-2 rounded-lg"
    >
      {({ open }) => (
        <>
          <div className="flex gap-x-2">
            <Disclosure.Button className="flex items-center gap-x-2 w-full">
              <ChevronUpIcon
                className={classNames(
                  `h-5 w-5`,
                  open ? "rotate-180 transform" : ""
                )}
              />
              <span>{category.name}</span>
            </Disclosure.Button>
            <Button
              forIcon
              variant={focusCategory === categoryAtom ? "primary" : "default"}
              onClick={() => {
                setFocusCategory(categoryAtom);
              }}
            >
              <CheckIcon className="w-5 h-5" />
            </Button>
            <Button forIcon>
              <ClipboardIcon className="w-5 h-5" />
            </Button>
            <Menu>
              <Menu.Button>
                <Button forIcon>
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </Button>
              </Menu.Button>
              <Menu.Dropdown direction="bottom-end">
                <Menu.Item icon={RectangleStackIcon}>
                  태그 전체 지우기
                </Menu.Item>
                <Menu.Item icon={PencilIcon}>이름변경</Menu.Item>
                <Menu.Item
                  icon={Square2StackIcon}
                  onClick={() => duplicate(category)}
                >
                  카테고리 복제
                </Menu.Item>
                <Menu.Item icon={TrashIcon} onClick={remove}>
                  카테고리 삭제
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
          <Disclosure.Panel className="px-4 pt-4 pb-2">
            <Menu>
              <Menu.Button>
                <Tag label={"Hello"} disabled={false} selected={false} />
              </Menu.Button>
              <Menu.Dropdown>
                <Menu.Item icon={ChevronDoubleUpIcon} disabled>
                  우선순위
                  <Button forIcon className="ml-2">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </Button>
                  <span className="mx-1">1</span>
                  <Button forIcon>
                    <ChevronRightIcon className="w-5 h-5" />
                  </Button>
                </Menu.Item>
                <Menu.Item icon={LockClosedIcon}>고정</Menu.Item>
                <Menu.Item icon={ClipboardIcon}>복사</Menu.Item>
                <Menu.Item icon={TrashIcon}>삭제</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
