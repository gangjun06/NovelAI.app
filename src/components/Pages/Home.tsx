import classNames from "classnames";
import { atom, useAtomValue, useSetAtom } from "jotai";
import type { NextPage } from "next";
import { useCallback, useMemo, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDebounce } from "use-debounce";
import tags from "~/assets/tags.json";
import { ResultBar, TagCard, updatePromptListAtom } from "~/components";
import { settingAtom } from "~/hooks/useSetting";
import { Tag as TagType, TagsData } from "~/types";
import { Input, Tag } from "../atoms";
import { MainTemplate } from "../template";

const nsfwAtom = atom((get) => get(settingAtom).useNSFW);

export const Home: NextPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 500);
  const updatePromptList = useSetAtom(updatePromptListAtom);
  const useNSFW = useAtomValue(nsfwAtom);

  const disabled = useMemo(() => text.length > 0, [text]);
  const onSelectGroup = useCallback((label: string) => {
    setSelected(null);
    setSelectedGroup((prev) => (prev === label ? "" : label));
  }, []);
  const onSelectTag = useCallback((label: string) => {
    setSelected((prev) => (prev === label ? "" : label));
  }, []);

  const groupList = useMemo(
    () =>
      Object.keys(tags as unknown as TagsData).filter(
        (str) => !str.startsWith("!") || useNSFW
      ),
    [useNSFW]
  );

  const categoryList = useMemo(() => {
    const current = (tags as unknown as TagsData)[selectedGroup];
    if (!current) return null;
    const result: { [key: string]: boolean } = {};
    for (const item of current) {
      if (item.nsfw && !useNSFW) continue;
      result[item.category] = true;
    }
    return Object.keys(result).reduce((a: string[], b) => [...a, b], []);
  }, [selectedGroup, useNSFW]);

  const filtered = useMemo(() => {
    const result: TagType[] = [];

    if (!disabled) {
      const current = (tags as unknown as TagsData)[selectedGroup];
      if (!current) {
        Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
          if (!useNSFW && key.startsWith("!")) return;
          list.forEach((item) => {
            if (!useNSFW && item.nsfw) return;
            result.push(item);
          });
        });
        return result;
      }
      return current.filter(
        ({ category, nsfw }) =>
          (selected ? category === selected : true) &&
          (!nsfw || (nsfw && useNSFW))
      );
    }

    Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
      if (!useNSFW && key.startsWith("!")) return;
      list.forEach((item) => {
        if (!useNSFW && item.nsfw) return;
        if (
          !item.category.includes(debouncedText) &&
          !item.subCategory.includes(debouncedText) &&
          !item.name.includes(debouncedText) &&
          !item.tags.includes(debouncedText)
        )
          return;
        result.push(item);
      });
    });
    return result;
  }, [debouncedText, disabled, selected, selectedGroup, useNSFW]);

  return (
    <MainTemplate title="태그생성기" description="NovelAI 태그 생성기">
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          updatePromptList({ from: source.index, to: destination?.index || 0 });
        }}
      >
        <div className={classNames("min-h-full")}>
          <h1 className="text-center text-4xl font-bold mt-8 text-title-color">
            NovelAI 태그 생성기
          </h1>
          <main className="container mx-auto px-4 mt-4">
            <section className="flex w-full items-center flex-col">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="키워드/태그를 입력하여 주세요"
                className="basic"
              />
              <div className="flex flex-wrap gap-2 mt-4 select-none w-full justify-center">
                {groupList.map((text) => (
                  <Tag
                    label={text.replace("!", "")}
                    key={text}
                    disabled={disabled}
                    selected={selected === text}
                    onSelect={() => onSelectGroup(text)}
                  />
                ))}
              </div>
              {categoryList && (
                <div className="flex flex-wrap gap-2 mt-4 select-none w-full justify-center">
                  {categoryList.map((text) => (
                    <Tag
                      label={text}
                      key={text}
                      disabled={disabled}
                      selected={selected === text}
                      onSelect={() => onSelectTag(text)}
                    />
                  ))}
                </div>
              )}
            </section>
            <section className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-16">
              {filtered.map(({ category, subCategory, name, tags }) => (
                <TagCard
                  key={`${category}/${subCategory}/${name}/${tags}`}
                  title={`${category}${
                    subCategory ? `/${subCategory}` : ""
                  } - ${name}`}
                  tags={tags}
                />
              ))}
            </section>
          </main>
        </div>
        <ResultBar />
      </DragDropContext>
    </MainTemplate>
  );
};
