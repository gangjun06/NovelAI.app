import toast from 'react-hot-toast'
// import { promptListAtom } from "./ResultBar";
import classNames from 'classnames'
import { atom, useAtomValue, useSetAtom } from 'jotai'

import { Tag } from '~/components/atoms'
import { appendTagCurrentAtom, directCopyAtom } from '~/components/organizm/TagTool/atoms'
import { settingAtom } from '~/hooks/useSetting'
import { copyText, replaceText } from '~/utils'

interface Props {
  category: string
  name: string
  tags: string[]
}

const replaceAtom = atom((get) => get(settingAtom).useCopyReplace)

export const TagToolCard = ({ category, name, tags }: Props) => {
  const appendTag = useSetAtom(appendTagCurrentAtom)
  const withUnderbar = useAtomValue(replaceAtom)
  const directCopy = useAtomValue(directCopyAtom)

  const onSelect = (tag: string) => {
    if (directCopy) {
      copyText(replaceText(tag, withUnderbar))
      toast.success('태그를 복사하였습니다!')
      return
    }
    appendTag({ category, name, tag })
  }

  return (
    <div
      className={classNames(
        'border shadow-sm rounded px-4 py-4 dark:bg-zinc-700/50 dark:border-base-dark dark:text-gray-300 bg-white border-base-light basic-full',
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
          )
        })}
      </div>
    </div>
  )
}
