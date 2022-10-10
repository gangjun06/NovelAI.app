import { useAtom, useSetAtom } from "jotai";
import { promptListAtom } from "./ResultBar";
import { Tag } from "./Tag";

interface Props {
  title: string;
  text: string;
}

export const TagCard = ({ title, text }: Props) => {
  const [promptList, setPromptList] = useAtom(promptListAtom);

  const appendTag = (tag: string) => {
    setPromptList((prev) => [...prev, { tag, pinned: false }]);
  };

  return (
    <div className="border border-gray-300 bg-white shadow-sm rounded-sm px-4 py-4">
      <div className="font-bold">{title}</div>
      <div className="flex flex-wrap gap-1 mt-1">
        {text.split(", ").map((text, index) => (
          <Tag
            key={index}
            onSelect={() => appendTag(text)}
            label={text}
            disabled={!!promptList.find((d) => d.tag === text)}
          />
        ))}
      </div>
    </div>
  );
};
