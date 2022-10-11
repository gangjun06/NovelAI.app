import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Tag } from "./Tag";
import { useCallback } from "react";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import { copyText } from "~/utils";
import { darkModeAtom } from "./DarkModeToggle";
import { Button } from "./Button";
import { copyAtom } from "./CopyToggle";

export const promptListAtom = atomWithStorage<
  { tag: string; pinned: boolean }[]
>("prompt-list", []);
export const updatePromptListAtom = atom(
  null,
  (get, set, { from, to }: { from: number; to: number }) => {
    const cloned = [...get(promptListAtom)];
    const item = get(promptListAtom)[from];

    cloned.splice(from, 1);
    cloned.splice(to, 0, item);
    set(promptListAtom, cloned);
  }
);

export const ResultBar = () => {
  const [promptList, setPromptList] = useAtom(promptListAtom);
  const copyEach = useAtomValue(copyAtom);

  const copyTag = useCallback((text: string) => {
    copyText(text);
    toast.success("프롬프트를 복사하였습니다!");
  }, []);

  const copyPrompt = useCallback(() => {
    copyText(promptList.reduce((a, b) => `${a}${b.tag}, `, "").slice(0, -2));
    toast.success("프롬프트를 복사하였습니다!");
  }, [promptList]);

  const resetPrompt = useCallback(() => {
    setPromptList((prev) => prev.filter(({ pinned }) => pinned));
  }, [setPromptList]);

  return (
    <div
      className={classNames(
        "fixed bottom-0 left-0 right-0 w-full border-t shadow-inner h-16 flex items-center justify-center select-none bg-white dark:bg-zinc-800 border-base-light dark:border-base-dark"
      )}
    >
      {!promptList.length ? (
        <div className="flex-1 px-6 text-gray-800 dark:text-gray-200">
          태그를 클릭하여 이곳에 추가하세요!
        </div>
      ) : (
        <Droppable droppableId="result-bar" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className="w-full flex items-center px-6 flex-grow gap-y-2 overflow-x-scroll hide-scroll"
              {...provided.droppableProps}
              ref={provided.innerRef}
              onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY;
              }}
            >
              {promptList.map((item, key) => (
                <Draggable key={item.tag} index={key} draggableId={item.tag}>
                  {(provided, snapshot) => (
                    <Tag
                      key={key}
                      selected={item.pinned}
                      left={() =>
                        item.pinned ? (
                          <></>
                        ) : (
                          <TrashIcon
                            className="dark:text-white"
                            width={18}
                            height={18}
                            onClick={() => {
                              setPromptList((prev) =>
                                prev.filter((_, index) => index !== key)
                              );
                            }}
                          />
                        )
                      }
                      onSelect={() => {
                        if (copyEach) {
                          copyTag(item.tag);
                          return;
                        }
                        setPromptList((prev) => {
                          const cloned = [...prev];
                          if (!cloned[key]) return cloned;
                          cloned[key].pinned = !cloned[key].pinned;
                          return cloned;
                        });
                      }}
                      label={item.tag}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mr-2"
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
      <div className="flex gap-x-3">
        <Button onClick={resetPrompt} disabled={promptList.length < 1}>
          리셋
        </Button>
        <Button
          onClick={copyPrompt}
          disabled={promptList.length < 1}
          variant="primary"
          className="mr-6"
        >
          복사
        </Button>
      </div>
    </div>
  );
};
