import { useSortable } from "@dnd-kit/sortable";
import {
  ChevronDoubleUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  LockClosedIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { atom, useAtom, useAtomValue } from "jotai";
import { Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { Button, Tag } from "~/components/atoms";
import { Menu } from "~/components/molecule";
import { ArchivedAtom } from "~/components/organizm/TagTool/atoms";
import { priorityAtom, settingAtom } from "~/hooks/useSetting";
import { copyText, formatPriority, replaceText } from "~/utils";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

interface Props {
  tagAtom: ArchivedAtom;
  remove?: () => void;
  duplicate?: () => void;
  index?: number;
}

export const TagToolPlaceholder = () => {
  const { attributes, setNodeRef, listeners, transform, transition } =
    useSortable({
      id: `placeholder`,
      resizeObserverConfig: {
        disabled: true,
      },
    });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: 0.3,
    position: "relative",
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Tag label="또는 이곳에 드래그" />
    </div>
  );
};

const replaceAtom = atom((get) => get(settingAtom).useCopyReplace);

export const TagToolTag = ({ tagAtom, remove, index, duplicate }: Props) => {
  const [tag, setTag] = useAtom(tagAtom);
  const priorityChar = useAtomValue(priorityAtom);
  const withUnderbar = useAtomValue(replaceAtom);

  const copyTag = () => {
    const text = `${formatPriority(
      tag.tag,
      tag.priority,
      priorityChar[0],
      priorityChar[1]
    )}`;
    copyText(replaceText(text, withUnderbar));
    toast.success("성공적으로 텍스트를 복사하였습니다.");
  };

  const handlePin = () => {
    setTag((prev) => ({ ...prev, pinned: !prev.pinned }));
  };

  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${tagAtom}`,
  });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: "relative",
    display: "inline-block",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
                <LockClosedIcon
                  width={18}
                  height={18}
                  className="dark:text-white"
                />
              ) : undefined
            }
          />
        </Menu.Button>

        <Menu.Dropdown>
          <Menu.ItemNoButton icon={ChevronDoubleUpIcon} disabled>
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
              className="mx-2 w-6 h-6 px-1 py-1 rounded text-sm text-center dark:bg-zinc-800/90"
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
          </Menu.ItemNoButton>
          <Menu.Item icon={LockClosedIcon} onClick={handlePin}>
            고정
          </Menu.Item>
          <Menu.Item icon={Square2StackIcon} onClick={duplicate}>
            복제
          </Menu.Item>
          <Menu.Item icon={ClipboardIcon} onClick={copyTag}>
            클립보드 복사
          </Menu.Item>
          <Menu.Item icon={TrashIcon} onClick={remove}>
            삭제
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};
