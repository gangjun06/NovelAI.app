import {
  ChevronUpIcon,
  RectangleStackIcon,
  ClipboardIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  CheckIcon,
  PencilIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import React, { useCallback } from "react";
import { Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { Button } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { Category, CategoryAtom } from "~/hooks/tagTool";
import { useDisclosure } from "~/hooks/useDisclosure";
import { priorityAtom } from "~/hooks/useSetting";
import { copyText, formatPriority } from "~/utils";
import { TagToolTag } from "./Tag";

interface Props {
  categoryAtom: CategoryAtom;
  remove: () => void;
  rename: () => void;
  duplicate: (value: Category) => void;
}

export const CategoryView = ({
  categoryAtom,
  remove,
  duplicate,
  rename,
}: Props) => {
  const [category, setCategory] = useAtom(categoryAtom);
  const priorityChar = useAtomValue(priorityAtom);
  const [open, handleOpen] = useDisclosure();

  const copyTag = useAtomCallback(
    useCallback(
      (get, _) => {
        let result = "";
        category.tags.forEach((tagAtom) => {
          const tag = get(tagAtom);
          result += `${formatPriority(
            tag.tag,
            tag.priority,
            priorityChar[0],
            priorityChar[1]
          )}, `;
        });
        result = result.slice(0, -2);
        copyText(result);
        toast.success("성공적으로 태그를 복사하였습니다.");
      },
      [category.tags, priorityChar]
    )
  );

  const cleanTag = useAtomCallback(
    useCallback(
      (get, set) => {
        handleOpen.open();
        const filtered = category.tags.filter((tagAtom) => {
          const tag = get(tagAtom);
          return tag.pinned;
        });
        set(categoryAtom, (prev) => ({ ...prev, tags: filtered }));
      },
      [category.tags, categoryAtom, handleOpen]
    )
  );

  const duplicateTag = useAtomCallback(
    useCallback(
      (get, set, index: number) => {
        set(categoryAtom, ({ tags, ...prev }) => ({
          ...prev,
          tags: [
            ...tags.slice(0, index + 1),
            atom(get(tags[index])),
            ...tags.slice(index + 1),
          ],
        }));
      },
      [categoryAtom]
    )
  );

  return (
    <div
      className="border border-base-color bg-white dark:bg-zinc-800/50 px-2 py-2 rounded-lg cursor-pointer"
      id={`category-${categoryAtom}`}
    >
      <div className="flex gap-x-2">
        <button
          className="flex items-center gap-x-2 w-full"
          onClick={handleOpen.toggle}
        >
          <ChevronUpIcon
            className={classNames(
              `h-5 w-5 text-title-color`,
              open ? "rotate-180 transform" : ""
            )}
          />
          <span className="text-title-color">{category.name}</span>
        </button>
        <Button
          forIcon
          variant={category.isFocus ? "primary" : "default"}
          onClick={() => {
            setCategory((prev) => ({ ...prev, isFocus: !prev.isFocus }));
          }}
        >
          <CheckIcon className="w-5 h-5" />
        </Button>
        <Button forIcon onClick={copyTag}>
          <ClipboardIcon className="w-5 h-5" />
        </Button>
        <Menu>
          <Menu.Button>
            <Button forIcon>
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </Menu.Button>
          <Menu.Dropdown direction="bottom-end">
            <Menu.Item icon={RectangleStackIcon} onClick={cleanTag}>
              태그 전체 지우기
            </Menu.Item>
            <Menu.Item icon={PencilIcon} onClick={rename}>
              이름변경
            </Menu.Item>
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

      {open && (
        <Droppable
          droppableId={`category-${categoryAtom}`}
          direction="horizontal"
        >
          {(provider) => (
            <div
              className="pl-4 pr-3 flex flex-wrap w-full mt-1 select-none"
              {...provider.droppableProps}
              ref={provider.innerRef}
            >
              {!category.tags.length && (
                <div className="text-description-color flex gap-x-1">
                  <CheckIcon className="w-5 h-5" /> 활성화후 클릭하여
                  추가하세요!
                </div>
              )}
              {category.tags.map((tagAtom, index) => (
                <TagToolTag
                  key={`${tagAtom}`}
                  index={index}
                  tagAtom={tagAtom}
                  duplicate={() => duplicateTag(index)}
                  remove={() => {
                    setCategory((prev) => ({
                      ...prev,
                      tags: prev.tags.filter(
                        (data) => `${data}` !== `${tagAtom}`
                      ),
                    }));
                  }}
                />
              ))}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};
