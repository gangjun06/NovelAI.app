import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  ChevronUpIcon,
  RectangleStackIcon,
  ClipboardIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  CheckIcon,
  Square2StackIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { atom, useAtom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, GripVerticalIcon, Input } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { Category, CategoryAtom } from "~/components/organizm/TagTool/atoms";
import { useDisclosure } from "~/hooks/useDisclosure";
import { priorityAtom, settingAtom } from "~/hooks/useSetting";
import { copyText, formatPriority, replaceText } from "~/utils";
import { TagToolPlaceholder, TagToolTag } from "./Tag";
import { CSS } from "@dnd-kit/utilities";

const PLACEHOLDER_ID = "placeholder";

const replaceAtom = atom((get) => get(settingAtom).useCopyReplace);
interface Props {
  categoryAtom: CategoryAtom;
  duplicate?: (value: Category) => void;
  remove?: () => void;
}
export const TagToolCategory = ({ categoryAtom, remove, duplicate }: Props) => {
  const [category, setCategory] = useAtom(categoryAtom);
  const priorityChar = useAtomValue(priorityAtom);
  const [open, handleOpen] = useDisclosure();
  const [rename, setRename] = useState<null | string>(null);
  const withUnderbar = useAtomValue(replaceAtom);

  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: `container-${categoryAtom}`,
  });

  const copyTag = useAtomCallback(
    useCallback(
      (get, _) => {
        let result = "";
        category.tags.forEach((tagAtom) => {
          const tag = get(tagAtom);
          result += `${replaceText(
            formatPriority(
              tag.tag,
              tag.priority,
              priorityChar[0],
              priorityChar[1]
            ),
            withUnderbar
          )}, `;
        });
        result = result.slice(0, -2);
        copyText(result);
        toast.success("성공적으로 태그를 복사하였습니다.");
      },
      [category.tags, priorityChar, withUnderbar]
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

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (((active?.id ?? "") as string).startsWith("container-")) {
      handleOpen.close();
    }
  }, [active?.id, handleOpen]);

  const duplicateTag = useAtomCallback(
    useCallback(
      (get, set) => {
        if (typeof duplicate !== "function") return;
        duplicate({
          ...category,
          tags: category.tags.map((tagAtom) => atom(get(tagAtom))),
        });
      },
      [category, duplicate]
    )
  );

  return (
    <div
      className={classNames(
        "border border-base-color px-2 rounded-lg cursor-pointer",
        over &&
          over.data.current?.sortable?.containerId ===
            `category-${categoryAtom}`
          ? "bg-gray-50 dark:bg-zinc-700"
          : "bg-white dark:bg-zinc-800/50 "
      )}
      style={style}
      ref={setNodeRef}
      id={`category-${categoryAtom}`}
    >
      <div className="flex gap-x-2 items-center">
        {rename !== null ? (
          <div className="flex items-center gap-x-2 w-full py-2">
            <Input
              value={rename}
              onChange={(e) => setRename(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && rename.trim().length > 0) {
                  setCategory((prev) => ({ ...prev, name: rename }));
                  setRename(null);
                } else if (e.key === "Escape") {
                  setRename(null);
                }
              }}
            />
            <Button
              variant="primary"
              disabled={rename.trim().length < 1}
              onClick={() => {
                setCategory((prev) => ({ ...prev, name: rename }));
                setRename(null);
              }}
            >
              저장
            </Button>
            <Button variant="default" onClick={() => setRename(null)}>
              취소
            </Button>
          </div>
        ) : (
          <button
            onClick={handleOpen.toggle}
            className="w-full flex items-center gap-x-2 py-2 text-left"
          >
            <ChevronUpIcon
              className={classNames(
                `h-5 w-5 text-title-color`,
                open ? "rotate-180 transform" : ""
              )}
            />
            <span className="text-title-color">{category.name}</span>
          </button>
        )}

        <div className="flex items-center gap-x-2 py-2">
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
              <Menu.Item
                icon={PencilIcon}
                disabled={rename !== null}
                onClick={() => setRename(category.name)}
              >
                이름변경
              </Menu.Item>
              <Menu.Item icon={Square2StackIcon} onClick={duplicateTag}>
                카테고리 복제
              </Menu.Item>
              <Menu.Item icon={TrashIcon} onClick={remove}>
                카테고리 삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {rename === null && (
            <GripVerticalIcon
              className="w-5 h-5 text-subtitle-color"
              {...attributes}
              {...listeners}
            />
          )}
        </div>
      </div>

      <SortableContext
        items={[
          ...category.tags.map((tagAtom) => `${tagAtom}`),
          PLACEHOLDER_ID,
        ]}
        id={`category-${categoryAtom}`}
        //@ts-ignore
        strategy={() => {}}
      >
        {open && !((active?.id ?? "") as string).startsWith("container-") && (
          <div className="pb-2">
            <Content categoryAtom={categoryAtom} />
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const Content = ({ categoryAtom }: Pick<Props, "categoryAtom">) => {
  const [category, setCategory] = useAtom(categoryAtom);

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
    <div className="pl-4 pr-3 w-full mt-1 select-none">
      {!category.tags.length && (
        <>
          <div className="text-description-color flex gap-x-1">
            <CheckIcon className="w-5 h-5" /> 아이콘 활성화 후 왼쪽에서 클릭하여
            추가하세요!
          </div>
          <TagToolPlaceholder />
        </>
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
              tags: prev.tags.filter((data) => `${data}` !== `${tagAtom}`),
            }));
          }}
        />
      ))}
    </div>
  );
};
