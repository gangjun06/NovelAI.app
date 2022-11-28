import { useCallback, useMemo, useState } from 'react'
import { ArchiveBoxIcon, RectangleGroupIcon } from '@heroicons/react/24/outline'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useDebounce } from 'use-debounce'

import tags from '~/assets/tags.json'
import { Input, Switch, Tag } from '~/components/atoms'
import { useResponsiveGrid } from '~/hooks/useResponsiveGrid'
import { settingAtom } from '~/hooks/useSetting'
import { Tag as TagType, TagsData } from '~/types'

import { directCopyAtom } from '../atoms'
import { TagToolCard } from './Card'

const nsfwAtom = atom((get) => get(settingAtom).useNSFW)

export const TagToolContent = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [selected, setSelected] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [debouncedText] = useDebounce(text, 500)
  const [directCopy, setDirectCopy] = useAtom(directCopyAtom)
  const useNSFW = useAtomValue(nsfwAtom)
  const { ref, gridStyle } = useResponsiveGrid([1, 2, 3, 4, 5, 6, 7])

  const disabled = useMemo(() => text.length > 0, [text])
  const onSelectGroup = useCallback((label: string) => {
    setSelected(null)
    setSelectedGroup((prev) => (prev === label ? '' : label))
  }, [])
  const onSelectTag = useCallback((label: string) => {
    setSelected((prev) => (prev === label ? '' : label))
  }, [])

  const groupList = useMemo(
    () => Object.keys(tags as unknown as TagsData).filter((str) => !str.startsWith('!') || useNSFW),
    [useNSFW],
  )

  const categoryList = useMemo(() => {
    const current = (tags as unknown as TagsData)[selectedGroup]
    if (!current) return null
    const result: { [key: string]: boolean } = {}
    for (const item of current) {
      if (item.nsfw && !useNSFW) continue
      result[item.category] = true
    }
    return Object.keys(result).reduce((a: string[], b) => [...a, b], [])
  }, [selectedGroup, useNSFW])

  const filtered = useMemo(() => {
    const result: TagType[] = []

    if (!disabled) {
      if (!selectedGroup) return []
      const current = (tags as unknown as TagsData)[selectedGroup]
      if (!current) {
        Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
          if (!useNSFW && key.startsWith('!')) return
          list.forEach((item) => {
            if (!useNSFW && item.nsfw) return
            result.push(item)
          })
        })
        return result
      }
      return current.filter(
        ({ category, nsfw }) =>
          (selected ? category === selected : true) && (!nsfw || (nsfw && useNSFW)),
      )
    }

    Object.entries(tags as unknown as TagsData).forEach(([key, list]) => {
      if (!useNSFW && key.startsWith('!')) return
      list.forEach((item) => {
        if (!useNSFW && item.nsfw) return
        if (
          !item.category.includes(debouncedText) &&
          !item.subCategory.includes(debouncedText) &&
          !item.name.includes(debouncedText) &&
          !(item.tags.findIndex((item) => item.includes(debouncedText)) > -1)
        )
          return
        result.push(item)
      })
    })
    return result
  }, [debouncedText, disabled, selected, selectedGroup, useNSFW])

  return (
    <>
      {/* <button
        className="fixed z-20 bottom-5 right-5 border-t border-l border-b border-base-color bg-white dark:bg-zinc-800 rounded-xl text-title-color px-2 py-2"
        onClick={() => {
          ref.current.scrollTo(0, 0);
        }}
      >
        <ChevronDoubleUpIcon className="w-6 h-6" />
      </button> */}
      <div className="overflow-y-auto relative h-full overflow-x-hidden" ref={ref}>
        <h1 className="text-center text-4xl font-bold pt-8 text-title-color">
          NovelAI 태그 생성기
        </h1>
        <main className="px-4 mt-4 tag-container">
          <section className="flex w-full items-center flex-col">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="키워드/태그를 입력하여 주세요"
              className="basic"
            />
            <div className="my-2">
              <Switch
                label="즉시 복사"
                checked={directCopy}
                onChange={(value) => setDirectCopy(value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 select-none w-full justify-center">
              {groupList.map((text) => (
                <Tag
                  label={text.replace('!', '')}
                  key={text}
                  disabled={disabled}
                  selected={selectedGroup === text}
                  onSelect={() => onSelectGroup(text)}
                  unselectedLeft={
                    <RectangleGroupIcon className="dark:text-white" width={20} height={20} />
                  }
                />
              ))}
            </div>
            {categoryList && (
              <div className="flex flex-wrap gap-2 mt-2 select-none w-full justify-center">
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
          {filtered.length === 0 && (
            <>
              <div className="mt-4 text-base-color text-center">
                <div>
                  {disabled ? (
                    '검색어를 찾을 수 없습니다.'
                  ) : (
                    <>
                      카테고리를 선택하여 태그를 확인하세요!
                      <br />
                      클릭하여 추가한 태그는 보관함
                      <ArchiveBoxIcon className="w-5 h-6 inline mx-2 pb-1" />
                      에서 확인할 수 있습니다
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          <section id="tag-list" className="mt-4 grid gap-4 pb-16" style={gridStyle}>
            {filtered.map(({ category, subCategory, name, tags }) => (
              <TagToolCard
                key={`${category}/${subCategory}/${name}/${tags}`}
                category={`${category}${subCategory ? `/${subCategory}` : ''}`}
                name={name}
                tags={tags}
              />
            ))}
          </section>
        </main>
      </div>
    </>
  )
}
