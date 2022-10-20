import { atom, useAtom, useAtomValue } from "jotai";
import toast from "react-hot-toast";
import { copyText, replaceText } from "~/utils";
import { promptListAtom } from "./ResultBar";
import { Tag } from "./atoms";
import classNames from "classnames";
import { settingAtom } from "~/hooks/useSetting";

interface Props {
  title: string;
  tags: string[];
}

const copyAtom = atom((get) => get(settingAtom).useCopyEach);
const replaceAtom = atom((get) => get(settingAtom).useCopyReplace);

export const TagCard = ({ title, tags }: Props) => {
  const [promptList, setPromptList] = useAtom(promptListAtom);
  const copyEach = useAtomValue(copyAtom);
  const withUnderbar = useAtomValue(replaceAtom);

  const updateTag = (tag: string) => {
    if (copyEach) {
      copyText(replaceText(tag, withUnderbar));
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
    <div
      className={classNames(
        "border shadow-sm rounded-sm px-4 py-4 dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 bg-white border-base-light basic-full"
      )}
    >
      <div className="font-bold">{title}</div>
      <div className="flex flex-wrap gap-1 mt-1 select-none">
        {tags.map((text, index) => {
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
