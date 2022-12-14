import toast from 'react-hot-toast'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { atom, PrimitiveAtom } from 'jotai'
import { atomWithStorage, splitAtom } from 'jotai/utils'

export type Archived = {
  category: string
  name: string
  tag: string
  pinned: boolean
  priority: number
}
export type ArchivedAtom = PrimitiveAtom<Archived>

export type Category = {
  name: string
  isFocus: boolean
  tags: ArchivedAtom[]
  isOpen: boolean
}

export type CategoryAtom = PrimitiveAtom<Category>

export const archivedCategoryAtom = atomWithStorage<Category[]>('archived-data', [
  {
    name: '기본 프롬프트',
    isFocus: true,
    isOpen: true,
    tags: [
      atom<Archived>({
        category: '품질/완성도',
        name: '명작',
        tag: 'masterpiece',
        pinned: false,
        priority: 0,
      }),
    ],
  },
  {
    isOpen: true,
    name: '부정 프롬프트',
    isFocus: false,
    tags: [],
  },
])
archivedCategoryAtom.onMount = (setAtom) => {
  setAtom((prev) =>
    prev.map((data) => {
      const tags = data.tags
        .filter((tagData) => tagData && (tagData as any).init)
        .map((tagData) => atom((tagData as any).init))
      return {
        ...data,
        isOpen: data.isOpen ?? false,
        tags,
      }
    }),
  )
}

export const archivedCategoryAtomsAtom = splitAtom(archivedCategoryAtom)

export const appendTagCurrentAtom = atom(
  null,
  (get, set, { category, name, tag }: { category: string; name: string; tag: string }) => {
    const newTag: Archived = {
      category,
      name,
      tag,
      pinned: false,
      priority: 0,
    }

    const categories = get(archivedCategoryAtomsAtom)
    let works = false
    categories.forEach((categoryAtom) => {
      const category = get(categoryAtom)
      if (!category.isFocus) return
      set(categoryAtom, {
        ...category,
        tags: [...category.tags, atom(newTag)],
      })
      const elem = document.getElementById(`category-${categoryAtom}`)
      const elem2 = document.getElementById(`show-library`)
      elem?.classList.add('adding-animation')
      elem2?.classList.add('adding-animation')
      setTimeout(() => {
        elem?.classList.remove('adding-animation')
        elem2?.classList.remove('adding-animation')
      }, 1000)
      works = true
    })
    if (!works) {
      toast.error('한개 이상의 카테고리를 선택하여 주세요.')
    }
  },
)

export const moveTagAtom = atom(null, (get, set, { active, over }: DragEndEvent) => {
  if (!over || active.id === over.id) return

  const atoms = get(archivedCategoryAtomsAtom)
  if ((active.id as string).startsWith('container-')) {
    set(archivedCategoryAtom, (prev) =>
      arrayMove(
        prev,
        active.data.current?.sortable.index ?? 0,
        over.data.current?.sortable.index ?? 0,
      ),
    )
    return
  }

  const activeContainerId = ((active.data.current?.sortable?.containerId as string) ?? '').replace(
    'category-',
    '',
  )

  const overContainerId = ((over?.data.current?.sortable?.containerId as string) ?? '').replace(
    'category-',
    '',
  )

  if (!activeContainerId || !overContainerId) return

  const activeIndex = active.data.current?.sortable?.index
  const overIndex = over.data.current?.sortable?.index

  if (activeContainerId === overContainerId) {
    const targetAtom = atoms.find((atomData) => `${atomData}` === activeContainerId)
    if (!targetAtom) return
    const target = get(targetAtom)

    const cloned = [...target.tags]
    const item = target.tags[activeIndex]

    cloned.splice(activeIndex, 1)
    cloned.splice(overIndex, 0, item)
    set(targetAtom, (prev) => ({ ...prev, tags: cloned }))
    return
  }
  const activeAtom = atoms.find((atomData) => `${atomData}` === activeContainerId)
  const overAtom = atoms.find((atomData) => `${atomData}` === overContainerId)
  if (!activeAtom || !overAtom) return

  const activeTags = [...get(activeAtom).tags.filter((tagAtom) => `${tagAtom}`)]
  const overItem = get(activeAtom).tags[activeIndex]
  activeTags.splice(activeIndex, 1)

  set(activeAtom, (prev) => ({
    ...prev,
    tags: activeTags,
  }))
  set(overAtom, ({ tags, ...prev }) => ({
    ...prev,
    tags: [...tags.slice(0, overIndex), overItem, ...tags.slice(overIndex)],
  }))
})

export const directCopyAtom = atomWithStorage<boolean>('fast-copy', false)
