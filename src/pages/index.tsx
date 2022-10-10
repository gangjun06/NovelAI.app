import type { NextPage } from "next";
import { CheckIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import tags from "~/assets/tags.json";
import { Tag, TagCard } from "~/components";
import { useDebounce } from "use-debounce";

const searchRegex = /([가-힇a-zA-Z_/]+|"[가-힇a-zA-Z_/ ]+")/g;

const Home: NextPage = () => {
  const [selected, setSelected] = useState<string>("");
  const [text, setText] = useState("");
  const [debouncedText] = useDebounce(text, 300);

  const disabled = useMemo(() => text.length > 0, [text]);
  const onSelectTag = useCallback((label: string) => {
    setSelected((prev) => (prev === label ? "" : label));
  }, []);

  const filtered = useMemo(() => {
    if (!disabled) {
      return selected === ""
        ? tags
        : tags.filter(({ category }) => category === selected);
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

    const result = tags.filter((tag) => {
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
    });
    return result;
  }, [debouncedText, disabled, selected]);

  return (
    <div className="bg-slate-50 min-h-full pb-4">
      <header className="pt-32">
        <h1 className="text-center text-4xl font-bold">NovelAI 태그찾기</h1>
        <div></div>
      </header>
      <main className="container mx-auto px-4 mt-8">
        <section className="flex w-full items-center flex-col">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="키워드/태그를 입력하여 주세요"
            className="basic"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              ...new Set(
                tags.reduce<string[]>((a, b) => [...a, b.category], [])
              ),
            ].map((text) => (
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
        <section className="mt-4 grid grid-cols-4 gap-4">
          {filtered.map(({ category, subCategory, name, tags }, index) => (
            <TagCard
              key={index}
              title={`${category}/${subCategory} - ${name}`}
              text={tags}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Home;
