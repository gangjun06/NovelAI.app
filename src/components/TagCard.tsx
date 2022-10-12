import { useAtom, useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { copyText } from "~/utils";
import { copyAtom } from "./CopyToggle";
import { promptListAtom } from "./ResultBar";
import { Tag } from "./Tag";

interface Props {
  title: string;
  text: string;
  visible:boolean
}

export const TagCard = ({ title, text, visible }: Props) => {
  const copyEach = useAtomValue(copyAtom);
  const [promptList, setPromptList] = useAtom(promptListAtom);

  const updateTag = (tag: string) => {
    if (copyEach) {
      copyText(tag);
      toast.success("태그를 복사하였습니다!");
      return;
    }
    setPromptList((prev) => {
      const index = prev.findIndex(({ tag: t }) => t === tag);
      if (index < 0) {
        return [...prev, { tag, pinned: false }];
      }
      const cloned = [...prev];
      cloned.splice(index, 1);
      return cloned;
    });
  };

  return (
    <div className="border shadow-sm rounded-sm px-4 py-4 dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 bg-white border-base-light"
        style={{display: visible ? 'block' : 'none'}}>
      <div className="font-bold">{title}</div>
      <div className="flex flex-wrap gap-1 mt-1 select-none">
        {text.split(", ").map((text, index) => {
          const selected = !!promptList.find((d) => d.tag === text);
          return (
            <Tag
              key={index}
              onSelect={() => updateTag(text)}
              selected={selected}
              label={text}
            />
          );
        })}
      </div>
    </div>
  );
};
