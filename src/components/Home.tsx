import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NextSeo } from "next-seo";
import tags from "~/assets/tags.json";
import {
  Tag,
  TagCard,
  ResultBar,
  updatePromptListAtom,
  NSFWToggle,
  showNSFWAtom,
} from "~/components";
import { useDebounce } from "use-debounce";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DragDropContext } from "react-beautiful-dnd";
import { darkModeAtom, DarkModeToggle } from "./DarkModeToggle";
import classNames from "classnames";
import { CopyToggle } from "./CopyToggle";
import { Tag as TagType, TagsData } from "~/types";

export const Home: NextPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 500);
  const updatePromptList = useSetAtom(updatePromptListAtom);
  const showNSFW = useAtomValue(showNSFWAtom);

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
        (str) => !str.startsWith("!") || showNSFW
      ),
    [showNSFW]
  );

  const categoryList = useMemo(() => {
    const current = (tags as unknown as TagsData)[selectedGroup];
    if (!current) return null;
    const result: { [key: string]: boolean } = {};
    for (const item of current) {
      if (item.nsfw && !showNSFW) continue;
      result[item.category] = true;
    }
    return Object.keys(result).reduce((a: string[], b) => [...a, b], []);
  }, [selectedGroup, showNSFW]);

  const filtered = useMemo(() => {
    const result: TagType[] = [];

    if (!disabled) {
      const current = (tags as unknown as TagsData)[selectedGroup];
      if (!current) {
        Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
          if (!showNSFW && key.startsWith("!")) return;
          list.forEach((item) => {
            if (!showNSFW && item.nsfw) return;
            result.push(item);
          });
        });
        return result;
      }
      return current.filter(
        ({ category, nsfw }) =>
          (selected ? category === selected : true) &&
          (!nsfw || (nsfw && showNSFW))
      );
    }

    Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
      if (!showNSFW && key.startsWith("!")) return;
      list.forEach((item) => {
        if (!showNSFW && item.nsfw) return;
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
  }, [debouncedText, disabled, selected, selectedGroup, showNSFW]);

  return (
    <>
      <NextSeo title="NovelAI Helper" description="NovelAI 태그 생성기" />
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          updatePromptList({ from: source.index, to: destination?.index || 0 });
        }}
      >
        <div className={classNames("min-h-full")}>
          <header className="pt-32 px-4">
            <h1 className="text-center text-4xl font-bold">
              NovelAI 태그 생성기
            </h1>
            <div className="text-center mt-1 text-gray-800 dark:text-zinc-400">
              <b>
                본 웹사이트는 Anlatan사의 NovelAI와 직접적인 관련이 없습니다.
              </b>
              <br />
              NovelAI 사용시 유용한 태그를 찾는 사이트입니다.{" "}
              <a href="https://docs.google.com/spreadsheets/d/18CA__L4yQOs9xAQslP5FUvooD8i8Wz-D7yCnsIYqoBM/edit?usp=sharing">
                태그목록
              </a>
              <br />
              아직 개발 중이며 로드맵은{" "}
              <a href="https://github.com/gangjun06/NovelAI.app/issues/1">
                이곳
              </a>{" "}
              에서 보실 수 있습니다.
              <br />
              <div className="flex gap-3 justify-center mt-1">
                <a href="mailto:me@gangjun.dev">문의</a>
                <a
                  href="https://github.com/gangjun06/NovelAI.app"
                  target="_blank"
                  rel="noreferrer"
                >
                  소스코드(깃허브)
                </a>
                <a
                  href="https://toss.me/gangjun"
                  target="_blank"
                  rel="noreferrer"
                >
                  개발자에게 커피 선물하기
                </a>
              </div>
            </div>
          </header>
          <div className="flex w-full justify-center gap-4 my-4">
            <NSFWToggle />
            <DarkModeToggle />
            <CopyToggle />
          </div>
          <main className="container mx-auto px-4 mt-4">
            <section className="flex w-full items-center flex-col">
              <input
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
                    selected={selectedGroup === text}
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
    </>
  );
};
