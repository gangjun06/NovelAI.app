import { Disclosure } from "@headlessui/react";
import {
  ChevronDoubleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  LockClosedIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAtom, useAtomValue } from "jotai";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { Button, Tag } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { ArchivedAtom } from "~/hooks/tagTool";
import { priorityAtom } from "~/hooks/useSetting";
import { copyText, formatPriority } from "~/utils";

export const MenuTag = ({
  tagAtom,
  remove,
  index,
}: {
  tagAtom: ArchivedAtom;
  remove: () => void;
  index: number;
}) => {
  const [tag, setTag] = useAtom(tagAtom);
  const priorityChar = useAtomValue(priorityAtom);

  const copyTag = () => {
    copyText(tag.tag);
    toast.success("성공적으로 텍스트를 복사하였습니다.");
  };

  const handlePin = () => {
    setTag((prev) => ({ ...prev, pinned: !prev.pinned }));
  };

  return (
    <Draggable key={`${tagAtom}`} index={index} draggableId={`${tagAtom}`}>
      {(provider) => (
        <div
          ref={provider.innerRef}
          {...provider.dragHandleProps}
          {...provider.draggableProps}
        >
          <Menu>
            <Menu.Button>
              <Tag
                label={formatPriority(
                  tag.tag,
                  tag.priority,
                  priorityChar[0],
                  priorityChar[1]
                )}
                className="mr-1"
                disabled={false}
                selected={tag.pinned}
                selectedLeft={
                  tag.pinned ? (
                    <LockClosedIcon width={18} height={18} />
                  ) : undefined
                }
              />
            </Menu.Button>

            <Menu.Dropdown>
              <Menu.Item icon={ChevronDoubleUpIcon} disabled>
                우선순위
                <Button
                  forIcon
                  className="ml-2"
                  onClick={() => {
                    if (tag.priority < 1) return;
                    setTag((prev) => ({
                      ...prev,
                      priority: prev.priority - 1,
                    }));
                  }}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </Button>
                <input
                  className="mx-2 w-6 h-6 px-1 py-1 rounded text-sm text-center"
                  value={tag.priority}
                  onClick={(e) => e.currentTarget.select()}
                  onChange={(e) => {
                    let priority = parseInt(e.currentTarget.value);
                    if (priority > 100) priority = 100;
                    if (priority < 0) priority = 0;
                    setTag((prev) => ({
                      ...prev,
                      priority,
                    }));
                  }}
                  type="number"
                />
                <Button
                  forIcon
                  onClick={() => {
                    if (tag.priority >= 100) return;
                    setTag((prev) => ({
                      ...prev,
                      priority: prev.priority + 1,
                    }));
                  }}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </Button>
              </Menu.Item>
              <Menu.Item icon={LockClosedIcon} onClick={handlePin}>
                고정
              </Menu.Item>
              <Menu.Item icon={ClipboardIcon} onClick={copyTag}>
                복사
              </Menu.Item>
              <Menu.Item icon={TrashIcon} onClick={remove}>
                삭제
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
    </Draggable>
  );
};
