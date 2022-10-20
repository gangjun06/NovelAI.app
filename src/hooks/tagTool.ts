import { atom, PrimitiveAtom } from "jotai";
import { atomWithStorage, splitAtom } from "jotai/utils";

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
  tags: ArchivedAtom[];
};

export type CategoryAtom = PrimitiveAtom<Category>;

export const archivedCategoryAtom = atomWithStorage<Category[]>(
  "archived-data",
  [
    {
      name: "Hello",
      tags: [],
    },
  ]
);
export const archivedCategoryAtomsAtom = splitAtom(archivedCategoryAtom);

export const focusCategoryDataAtom = atom<CategoryAtom | null>(null);
export const focusCategoryAtom = atom<CategoryAtom, CategoryAtom>(
  (get) => get(focusCategoryDataAtom) ?? get(archivedCategoryAtomsAtom)[0],
  (_, set, update) => set(focusCategoryDataAtom, update)
);
