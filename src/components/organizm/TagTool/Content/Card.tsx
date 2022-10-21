import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import toast from "react-hot-toast";
import { copyText, replaceText } from "~/utils";
// import { promptListAtom } from "./ResultBar";
import classNames from "classnames";
import { settingAtom } from "~/hooks/useSetting";
import { Tag } from "~/components/atoms";
import { appendTagCurrentAtom } from "~/hooks/tagTool";

interface Props {
  category: string;
  name: string;
  tags: string[];
}

const copyAtom = atom((get) => get(settingAtom).useCopyEach);
const replaceAtom = atom((get) => get(settingAtom).useCopyReplace);

export const TagCard = ({ category, name, tags }: Props) => {
  const appendTag = useSetAtom(appendTagCurrentAtom);
  const copyEach = useAtomValue(copyAtom);
  const withUnderbar = useAtomValue(replaceAtom);

  const onSelect = (tag: string) => {
    if (copyEach) {
      copyText(replaceText(tag, withUnderbar));
      toast.success("태그를 복사하였습니다!");
      return;
    }
    appendTag({ category, name, tag });
  };

  return (
    <div
      className={classNames(
        "border shadow-sm rounded px-4 py-4 dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 bg-white border-base-light basic-full"
      )}
    >
      <div className="font-bold">{`${category} - ${name}`}</div>
      <div className="flex flex-wrap gap-1 mt-1 select-none">
        {tags.map((text, index) => {
          // const selected = !!promptList.find((d) => d.tag === text);
          return (
            <Tag
              key={index}
              onSelect={() => onSelect(text)}
              // selected={selected}
              label={text}
            />
          );
        })}
      </div>
    </div>
  );
};
