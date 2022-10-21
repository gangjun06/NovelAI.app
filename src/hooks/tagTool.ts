import { atom, PrimitiveAtom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";
import { DropResult } from "react-beautiful-dnd";
import toast from "react-hot-toast";

export type Archived = {
  category: string;
  name: string;
  tag: string;
  pinned: boolean;
  priority: number;
};
export type ArchivedAtom = PrimitiveAtom<Archived>;

export type Category = {
  name: string;
  isFocus: boolean;
  tags: ArchivedAtom[];
};

export type CategoryAtom = PrimitiveAtom<Category>;

export const archivedCategoryAtom = atomWithStorage<Category[]>(
  "archived-data",
  [
    {
      name: "Hello",
      isFocus: false,
      tags: [
        atom<Archived>({
          category: "hello",
          name: "name",
          tag: "tag",
          pinned: false,
          priority: 0,
        }),
      ],
    },
  ]
);
archivedCategoryAtom.onMount = (setAtom) => {
  setAtom((prev) =>
    prev.map((data) => ({
      ...data,
      //@ts-ignore
      tags: data.tags.map((tagData) => atom(tagData.init)),
    }))
  );
};

export const archivedCategoryAtomsAtom = splitAtom(archivedCategoryAtom);

export const appendTagCurrentAtom = atom(
  null,
  (
    get,
    set,
    { category, name, tag }: { category: string; name: string; tag: string }
  ) => {
    const newTag: Archived = {
      category,
      name,
      tag,
      pinned: false,
      priority: 0,
    };

    const categories = get(archivedCategoryAtomsAtom);
    let works = false;
    categories.forEach((categoryAtom) => {
      const category = get(categoryAtom);
      if (!category.isFocus) return;
      set(categoryAtom, {
        ...category,
        tags: [...category.tags, atom(newTag)],
      });
      const elem = document.getElementById(`category-${categoryAtom}`);
      elem?.classList.add("adding-animation");
      setTimeout(() => {
        elem?.classList.remove("adding-animation");
      }, 1000);
      works = true;
    });
    if (!works) {
      toast.error("한개 이상의 카테고리를 선택하여 주세요.");
    }
  }
);

export const moveTagAtom = atom(
  null,
  (get, set, { destination, source }: DropResult) => {
    if (!destination) return;

    const atoms = get(archivedCategoryAtomsAtom);

    const sourceAtomStr = source.droppableId.replace("category-", "");
    const destAtomStr = destination.droppableId.replace("category-", "");

    if (sourceAtomStr === destAtomStr) {
      // Same Category => Swap
      const targetAtom = atoms.find(
        (atomData) => `${atomData}` === sourceAtomStr
      );
      if (!targetAtom) return;
      const target = get(targetAtom);

      const cloned = [...target.tags];
      const item = target.tags[source.index];

      cloned.splice(source.index, 1);
      cloned.splice(destination.index, 0, item);
      set(targetAtom, (prev) => ({ ...prev, tags: cloned }));
      return;
    }

    // Not Same Category => Remove and insert
    const sourceAtom = atoms.find(
      (atomData) => `${atomData}` === sourceAtomStr
    );
    const destAtom = atoms.find((atomData) => `${atomData}` === destAtomStr);
    if (!sourceAtom || !destAtom) return;

    const sourceTags = [...get(sourceAtom).tags];
    const destItem = get(get(sourceAtom).tags[source.index]);
    sourceTags.splice(source.index, 1);

    set(sourceAtom, (prev) => ({
      ...prev,
      tags: sourceTags,
    }));
    set(destAtom, ({ tags, ...prev }) => ({
      ...prev,
      tags: [
        ...tags.slice(0, destination.index),
        atom(destItem),
        ...tags.slice(destination.index),
      ],
    }));
  }
);
