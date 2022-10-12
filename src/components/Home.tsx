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

const searchRegex = /([가-힇a-zA-Z_/]+|"[가-힇a-zA-Z_/ ]+")/g;

export const Home: NextPage = () => {
  const [selected, setSelected] = useState<string>("");
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);
  const updatePromptList = useSetAtom(updatePromptListAtom);
  const showNSFW = useAtomValue(showNSFWAtom);

  const disabled = useMemo(() => text.length > 0, [text]);
  const onSelectTag = useCallback((label: string) => {
    setSelected((prev) => (prev === label ? "" : label));
  }, []);

  const filteredTag = useMemo(
    () => [
      ...new Set(
        tags
          .filter(({ nsfw }) => !nsfw || (nsfw && showNSFW))
          .reduce<string[]>((a, b) => [...a, b.category], [])
      ),
    ],
    [showNSFW]
  );

  const filtered = useMemo(() => {
    if (!disabled) {
      let result = []
      for(let i=0;i<tags.length;i++){
        const tag = tags[i]
        if(selected === ""  ? true : tag.category === selected && (!tag.nsfw || (tag.nsfw && showNSFW))){
          result.push()
        }
        result.push({
          id: tag.id,
          category: tag.category,
          subCategory: tag.subCategory,
          name: tag.name,
          tags: tag.tags,
          nsfw: tag.nsfw,
          visible: selected === ""  ? true : tag.category === selected && (!tag.nsfw || (tag.nsfw && showNSFW))
        })
      }
      return result
    }
    const matched =
      debouncedText.match(searchRegex)?.map((text) => {
        text = text.toLowerCase();
        if (text.startsWith('"')) {
          return {
            keyword: text.substring(1).slice(0, -1),
            isFull: true,
            isEnglish: !!text.match(/^[a-zA-Z_]+$/),
            hasSpace: text.includes(" "),
          };
        }
        return {
          keyword: text,
          isCategory: text.includes("/"),
          isEnglish: !!text.match(/^[a-zA-Z_]+$/),
        };
      }) ?? null;
    if (!matched) return [];


    let result = []



    for(let i=0;i<tags.length;i++){
      let tag = tags[i]
      function check(){
        if (tag.nsfw && !showNSFW) return false;
        if(!matched){
          return false
        }
        for (const data of matched) {
          if (data.isFull) {
            if (data.isEnglish)
              return tag.tags.toLowerCase().includes(data.keyword);
            if (data.hasSpace) {
              if (tag.name.includes(data.keyword)) return true;
            } else {
              if (tag.category.includes(data.keyword)) return true;
              if (tag.subCategory.includes(data.keyword)) return true;
              if (`${tag.category}/${tag.subCategory}`.includes(data.keyword))
                return true;
            }
            return false;
          }
  
          if (data.isCategory) {
            return `${tag.category}/${tag.subCategory}`.includes(data.keyword);
          }
  
          if (data.isEnglish) {
            return tag.tags.toLowerCase().includes(data.keyword);
          }
  
          if (tag.name.includes(data.keyword)) return true;
          if (tag.category.includes(data.keyword)) return true;
          if (tag.subCategory.includes(data.keyword)) return true;
        }
        return false;
      }
      result.push({
        id: tag.id,
        category: tag.category,
        subCategory: tag.subCategory,
        name: tag.name,
        tags: tag.tags,
        nsfw: tag.nsfw,
        visible: check()
      })
    }

    return result;
  }, [debouncedText, disabled, selected, showNSFW]);

  console.log(filtered)
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
              <a href="https://arca.live/b/aiart/60305526">태그출처</a>
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
              <div className="flex flex-wrap gap-2 mt-4 select-none">
                {filteredTag.map((text) => (
                  <Tag
                    label={text}
                    key={text}
                    disabled={disabled}
                    selected={selected === text}
                    onSelect={() => onSelectTag(text)}
                  />
                ))}
              </div>
            </section>
            <section className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-16">
              {filtered.map(({ id, category, subCategory, name, tags, visible }) => (
                <TagCard
                  key={id}
                  title={`${category}/${subCategory} - ${name}`}
                  text={tags}
                  visible={visible}
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
